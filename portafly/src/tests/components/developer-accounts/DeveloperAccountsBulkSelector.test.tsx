/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'

import { render } from 'tests/custom-render'
import { BulkSelector } from 'components/developer-accounts'
import { fireEvent, within } from '@testing-library/react'

const defaultProps = {
  onSelectAll: jest.fn(),
  onSelectPage: jest.fn(),
  pageCount: 10,
  allCount: 20,
  selectedCount: 0
}

it('expands and collapses properly', () => {
  const wrapper = render(<BulkSelector {...defaultProps} />)
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

it('should render properly when all are selected', () => {
  const wrapper = render(<BulkSelector {...defaultProps} selectedCount={20} />)
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('should render properly when some are selected', () => {
  const wrapper = render(<BulkSelector {...defaultProps} selectedCount={5} />)
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('should render properly when none are selected', () => {
  const wrapper = render(<BulkSelector {...defaultProps} />)
  expect(wrapper.container.firstChild).toMatchSnapshot()
})
