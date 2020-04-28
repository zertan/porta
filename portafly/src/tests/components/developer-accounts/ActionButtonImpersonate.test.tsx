import React from 'react'

import { render } from 'tests/custom-render'
import { ActionButtonImpersonate } from 'components/developer-accounts'
import { RenderResult } from '@testing-library/react'

let wrapper: RenderResult

beforeEach(() => {
  wrapper = render(<ActionButtonImpersonate />)
})

it('should render properly', () => {
  expect(wrapper.container.firstChild).toMatchSnapshot()
})
