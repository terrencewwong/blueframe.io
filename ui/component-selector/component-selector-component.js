import React, { Component } from 'react'
import { Input, StyleCascader, Text } from '../../blueframe/atoms'
import { Container, Split, Distribute } from '../../blueframe/layouts'
import componentSchemas from '../../component-schemas.json'

// TODO: support all of the components
const Components = Object.keys(componentSchemas)

export default class SelectOverlayComponent extends Component {
  state = {
    filter: ''
  }

  componentDidMount () {
    this.listener = window.addEventListener('keydown', this.handleEscape)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.listener)
  }

  setFilter = e => this.setState({ filter: e.target.value })
  handleEscape = e => {
    const { onEscape } = this.props

    if (e.keyCode === 27) {
      onEscape()
    }
  }

  render () {
    const { onSelectComponent } = this.props
    const filter = this.state.filter.toLowerCase()

    const filtered = filter
      ? Components.filter(c => c.toLowerCase().startsWith(filter))
      : Components

    const filteredComponents = filtered.map(component => (
      <Text
        key={component}
        size='size1'
        onClick={() => onSelectComponent(component)}
      >
        {component}
      </Text>
    ))

    return (
      <StyleCascader>
        <Container
          size='viewport'
          bg='rgba(240, 240, 240, 0.7)'
          center-horizontal
          center-vertical
          additionalCSS={`
            position: fixed;
            top: 0;
          `}
        >
          <Container size='xlg'
            additionalCSS={`
              height: auto;
              border-radius: 4px;
              box-shadow: 0 1px 4px 0 rgba(0,0,0,0.1), 0 2px 66px 0 rgba(0,0,0,0.05);
            `}
          >
            <Input
              type='text'
              width='100%'
              left={3} right={3}
              onChange={this.setFilter}
              big
              no-outline
              spellCheck={false}
            />
            <Container
              height='md'
              top={2}
              left={3}
              right={3}
              bg='white'
              additionalCSS={`
                /* TODO: remove border-top from here */
                border-top: 1px solid #cacaca;
                overflow-y: scroll;
              `}
            >
              <Distribute vertical space={2}>
                {filteredComponents}
              </Distribute>
            </Container>
          </Container>
        </Container>
      </StyleCascader>
    )
  }
}
