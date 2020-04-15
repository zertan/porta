import React from 'react'

import { render } from 'tests/custom-render'
import { DeveloperAccountsSearchWidget } from 'components'
import { RenderResult, fireEvent } from '@testing-library/react'

const filterOptions = ['Organization', 'Name', 'State']

let wrapper: RenderResult

beforeEach(() => {
  wrapper = render(<DeveloperAccountsSearchWidget options={filterOptions} />)
})

it('should render properly', () => {
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('should have the first filter selected by default', () => {
  const targetOption = /organization/i
  expect(wrapper.getByText(targetOption)).toBeInTheDocument()
  // FIXME: need to mock i18n or remove this assertion
  // expect(wrapper.getByPlaceholderText(targetOption)).toBeInTheDocument()
})

it('should be able to select any filter option', () => {
  const targetOption = /name/i
  expect(wrapper.queryAllByText(targetOption).length).toEqual(0)

  const dropdownButton = wrapper.getByText(filterOptions[0]).closest('button')
  fireEvent.click(dropdownButton as HTMLButtonElement)
  fireEvent.click(wrapper.getByText(targetOption))

  expect(wrapper.getByText(targetOption)).toBeInTheDocument()
  // FIXME: need to mock i18n or remove this assertion
  // expect(wrapper.getByPlaceholderText(targetOption)).toBeInTheDocument()
})
