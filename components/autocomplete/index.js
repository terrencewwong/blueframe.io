// @flow
import React from 'react'
import styled from 'styled-components'
import ReactAutocomplete from 'react-autocomplete'
import { TAB } from '../keycodes'
import Input from './input'
import Menu from './menu'
import MenuItem from './menu-item'

type Props = {
  value: string,
  getItemValue: (item: *) => string,
  items: Array<*>,
  onValueChange?: (value: string) => void,
  inputRef?: (input: HTMLInputElement) => *,
  onInputBlur?: (e: Event) => void,
  onInputKeyDown?: (e: Event) => void
}
export default class Autocomplete extends React.Component<Props> {
  static defaultProps = {
    value: '',
    getItemValue: x => x
  }

  autocomplete: ?ReactAutocomplete

  _getMatchedItemValue = (): ?string => {
    const { getItemValue, items, value } = this.props
    const matched: any = items.find(item =>
      getItemValue(item).toLowerCase()
        .startsWith(value.toLowerCase())
    )

    return matched && getItemValue(matched)
  }

  handleChange = (_: mixed, value: string) => {
    const { onValueChange } = this.props
    onValueChange && onValueChange(value)
  }

  handleSelect = (value: string) => {
    const { onValueChange } = this.props
    onValueChange && onValueChange(value)
  }

  handleBlur = (e: Event) => {
    const { onInputBlur } = this.props
    onInputBlur && onInputBlur(e)
  }

  handleKeyDown = (e: Event) => {
    // use enter key to select takes precedence!
    // this is a total hack... not sure how else to implement this besides
    // checking the autocompletes state
    if (e.keyCode === 13
        && this.autocomplete
        && this.autocomplete.state.highlightedIndex !== null
    ) {
      return
    }

    // tab-complete takes precedence...!
    if (!e.shiftKey && e.keyCode === TAB) {
      const { value, onValueChange } = this.props
      const tabCompleteValue = this._getMatchedItemValue()

      if (tabCompleteValue && tabCompleteValue !== value) {
        e.preventDefault()
        onValueChange && onValueChange(tabCompleteValue)
        return
      }
    }

    const { onInputKeyDown } = this.props
    onInputKeyDown && onInputKeyDown(e)
  }

  handleSortItems = (itemA: *, itemB: *, value: string) => {
    const { getItemValue } = this.props

    const valueLowerCase = value.toLowerCase()
    const itemAValue = getItemValue(itemA).toLowerCase()
    const itemBValue = getItemValue(itemB).toLowerCase()


    const valueIsPrefixOfItemA = itemAValue.startsWith(valueLowerCase)
    const valueIsPrefixOfItemB = itemBValue.startsWith(valueLowerCase)

    if (valueIsPrefixOfItemA && !valueIsPrefixOfItemB) {
      return -1
    } else if (!valueIsPrefixOfItemA && valueIsPrefixOfItemB) {
      return 1
    } else {
      return itemAValue.localeCompare(itemBValue)
    }
  }

  renderInput = ({ inputRef, ref, ...props }: *) => {
    const { items } = this.props
    // lol hack, now we can get a ref to this input from the outside
    const innerRef = elem => {
      inputRef && inputRef(elem)
      ref(elem)
    }
    return <Input innerRef={innerRef} {...props} />
  }

  componentDidMount () {
    const { autocomplete } = this
    const { value } = this.props
    if (autocomplete) {
      autocomplete.focus()
      if (value) {
        autocomplete.setSelectionRange(0, value.length)
      }
    }
  }

  render () {
    const {
      getItemValue,
      items,
      inputRef,
      value,
      ...rest
    } = this.props

    return (
      <ReactAutocomplete
        value={value}
        inputProps={{
          inputRef,
          onBlur: this.handleBlur,
          onKeyDown: this.handleKeyDown
        }}
        ref={autocomplete => this.autocomplete = autocomplete}
        getItemValue={getItemValue}
        items={items}
        renderItem={(item, isHighlighted) => {
          const itemValue = getItemValue(item)
          return (
            <MenuItem key={itemValue} isHighlighted={isHighlighted}>
              {itemValue}
            </MenuItem>
          )
        }}
        renderMenu={(items, value) => {
          const hasMatch = !!items.find(item =>
            item.key.toLowerCase().startsWith(value.toLowerCase())
          )

          return (
            <Menu>
              {!hasMatch && <MenuItem error>No match</MenuItem>}
              {items}
            </Menu>
          )
        }}
        sortItems={this.handleSortItems}
        renderInput={this.renderInput}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        {...rest}
      />
    )
  }
}
