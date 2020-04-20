import React, { FunctionComponent, useMemo } from 'react'
import { Pagination, OnSetPage, OnPerPageSelect } from '@patternfly/react-core'

interface IPagination {
  itemCount: number
  page: number
  onSetPage: OnSetPage
  perPage: number
  onPerPageSelect: OnPerPageSelect
}

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
]

const DeveloperAccountsPagination: FunctionComponent<IPagination> = ({
  itemCount,
  page,
  perPage,
  onSetPage,
  onPerPageSelect
}) => {
  const isCompact = useMemo(() => (itemCount / perPage) < 3, [itemCount, perPage])

  return (
    <Pagination
      itemCount={itemCount}
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      perPageOptions={perPageOptions}
      isCompact={isCompact}
    />
  )
}

export { DeveloperAccountsPagination }
