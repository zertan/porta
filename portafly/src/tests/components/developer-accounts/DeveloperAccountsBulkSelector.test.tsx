/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'

import { render } from 'tests/custom-render'
import { DeveloperAccountsBulkSelector } from 'components'
import { RenderResult, fireEvent, within } from '@testing-library/react'

function renderWrapper(props?: any): RenderResult {
  return render(
    <DeveloperAccountsBulkSelector
      onSelectAll={jest.fn()}
      onSelectPage={jest.fn()}
      pageCount={10}
      allCount={25}
      {...props}
    />
  )
}

it('expands and collapses properly', () => {
  const wrapper = renderWrapper()
  expect(wrapper.queryByRole('menu')).not.toBeInTheDocument()

  const button = wrapper.getByRole('button')
  fireEvent.click(button)

  const menu = within(wrapper.getByRole('menu'))
  expect(menu.getByText('accounts_table.data_toolbar.bulk_selector.none')).toBeInTheDocument()
  expect(menu.getByText('accounts_table.data_toolbar.bulk_selector.page')).toBeInTheDocument()
  expect(menu.getByText('accounts_table.data_toolbar.bulk_selector.all')).toBeInTheDocument()

  fireEvent.click(button)
  expect(wrapper.queryByRole('menu')).not.toBeInTheDocument()
})

describe('when it is checked', () => {
  let wrapper: RenderResult

  beforeEach(() => {
    wrapper = renderWrapper({ isChecked: true })
  })

  it('should render properly', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })
})

describe('when it is unchecked', () => {
  let wrapper: RenderResult

  beforeEach(() => {
    wrapper = renderWrapper({ isChecked: false })
  })

  it('should render properly', () => {
    expect(wrapper.container.firstChild).toMatchSnapshot()
  })
})
