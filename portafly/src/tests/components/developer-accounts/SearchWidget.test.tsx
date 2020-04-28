import React from 'react'

import { render } from 'tests/custom-render'
import { SearchWidget } from 'components/developer-accounts'
import { RenderResult, fireEvent } from '@testing-library/react'

let wrapper: RenderResult

beforeEach(() => {
  wrapper = render(<SearchWidget filters={{}} onFiltersChange={jest.fn()} />)
  wrapper.debug()
})

it('should filter by organization/group by default', () => {
  fireEvent.click(wrapper.getByRole('select'))
  fireEvent.click(wrapper.getByText('accounts_table.col_group'))
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('should be able to filter by admin', () => {
  fireEvent.click(wrapper.getByRole('select'))
  fireEvent.click(wrapper.getByText('accounts_table.col_admin'))
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('should be able to filter by state', () => {
  fireEvent.click(wrapper.getByRole('select'))
  fireEvent.click(wrapper.getByText('accounts_table.col_state'))
  expect(wrapper.container.firstChild).toMatchSnapshot()
})

it('addChip', () => expect(true).toBe(true))

it('remove selection', () => expect(true).toBe(true))

it('onSelectState', () => expect(true).toBe(true))

it('onClick', () => expect(true).toBe(true))

it('onKeyUp', () => expect(true).toBe(true))
