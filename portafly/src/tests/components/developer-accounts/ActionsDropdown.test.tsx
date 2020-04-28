import React from 'react'

import { render } from 'tests/custom-render'
import { ActionsDropdown } from 'components/developer-accounts'
import { fireEvent, RenderResult } from '@testing-library/react'

it('expands and collapses properly', () => {
  const wrapper = render(<ActionsDropdown selectAction={jest.fn()} />)
  expect(wrapper.queryByRole('menu')).not.toBeInTheDocument()

  const button = wrapper.getByRole('button')
  fireEvent.click(button)
  expect(wrapper.queryByRole('menu')).toBeInTheDocument()

  fireEvent.click(button)
  expect(wrapper.queryByRole('menu')).not.toBeInTheDocument()
})

describe('when it is disabled', () => {
  let wrapper: RenderResult

  beforeEach(() => {
    wrapper = render(<ActionsDropdown selectAction={jest.fn()} isDisabled />)
  })

  it('should render properly when closed', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })

  it('shows a warning inside the dropdown when opened', () => {
    const button = wrapper.getByRole('button')
    fireEvent.click(button)

    expect(wrapper.container.firstChild).toMatchSnapshot()
  })
})

describe('when it is enabled', () => {
  let wrapper: RenderResult

  beforeEach(() => {
    wrapper = render(<ActionsDropdown selectAction={jest.fn()} isDisabled={false} />)
  })
  it('should render properly when closed', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })

  it('shows the list of options when opened', () => {
    const button = wrapper.getByRole('button')
    fireEvent.click(button)

    expect(wrapper.container.firstChild).toMatchSnapshot()
  })
})
