import React from 'react'

import { render } from 'tests/custom-render'
import { ChangeStateModal } from 'components/developer-accounts'
import { RenderResult } from '@testing-library/react'

let wrapper: RenderResult

beforeEach(() => {
  wrapper = render(<ChangeStateModal onClose={jest.fn()} admins={[]} />)
})

it('should render properly', () => {
  expect(wrapper.container.firstChild).toMatchSnapshot()
})
