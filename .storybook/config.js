import React from 'react'
import { configure } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'

const req = require.context('../components', true, /\-story.js$/)

function loadStories () {
  req.keys().forEach(req)
}

setOptions({
  name: 'blueframe',
  url: 'https://github.com/terrencewwong/blueframe',
  downPanelInRight: true,
  sortStoriesByKind: true
})

configure(loadStories, module)
