import React from 'react'

import { render } from 'tests/custom-render'
import { TablePagination } from 'components'

it('should render compacted when there are 1-2 pages only', () => {
  const wrapper = render(<TablePagination itemCount={5} state={{ perPage: 5 }} dispatch={jest.fn()} />)
  expect(wrapper.container.querySelector('.pf-m-compact')).toBeInTheDocument()
})

it('should render NOT compacted when there are 3 or more pages', () => {
  const wrapper = render(<TablePagination itemCount={5} state={{ perPage: 1 }} dispatch={jest.fn()} />)
  expect(wrapper.container.querySelector('.pf-m-compact')).not.toBeInTheDocument()
})
