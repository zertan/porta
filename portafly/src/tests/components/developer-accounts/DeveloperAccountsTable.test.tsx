import React from 'react'

import { render } from 'tests/custom-render'
import { DeveloperAccountsTable } from 'components'
import { developerAccounts } from 'tests/examples'
import { RenderResult, fireEvent, within } from '@testing-library/react'

let wrapper: RenderResult

describe('when there are any accounts', () => {
  beforeEach(() => {
    wrapper = render(<DeveloperAccountsTable accounts={developerAccounts} />)
  })

  it('should render a table with accounts', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })

  it('should be able to select one account', () => {
    const row = wrapper.getByText(developerAccounts[0].org_name).closest('tr') as HTMLElement
    const checkbox = within(row).getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('should be able to select all accounts', () => {
    const checkboxes = wrapper.getAllByRole('checkbox')
    const isChecked = (c: HTMLElement) => (c as HTMLInputElement).checked
    expect(checkboxes.filter(isChecked).length).toEqual(0)

    const checkbox = wrapper.getByTestId('developer-accounts-bulk-checkbox')
    fireEvent.click(checkbox)
    expect(checkboxes.filter(isChecked).length).toEqual(developerAccounts.length + 1)

    fireEvent.click(checkbox)
    expect(checkboxes.filter(isChecked).length).toEqual(0)
  })
})

describe('when there are NO accounts', () => {
  beforeEach(() => {
    wrapper = render(<DeveloperAccountsTable accounts={[]} />)
  })

  it('should render an empty view', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })
})
