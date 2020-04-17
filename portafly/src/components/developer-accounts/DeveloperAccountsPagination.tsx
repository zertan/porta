import React, { useState, FunctionComponent } from 'react'
import { Pagination, OnSetPage, OnPerPageSelect } from '@patternfly/react-core'

interface IPagination {
  itemCount: number
  onPageIdxChange: (pageIdx: { startIdx: number, endIdx: number }) => void
}

const DeveloperAccountsPagination: FunctionComponent<IPagination> = ({
  itemCount,
  onPageIdxChange
}) => {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(5)

  const perPageOptions = [
    { title: '5', value: 5 },
    { title: '20', value: 20 },
    { title: '50', value: 50 }
  ]

  const onSetPage: OnSetPage = (ev, newPage, _perPage, startIdx, endIdx) => {
    setPage(newPage)
    onPageIdxChange({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  const onPerPageSelect: OnPerPageSelect = (ev, newPerPage, newPage, startIdx, endIdx) => {
    setPerPage(newPerPage)
    onPageIdxChange({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  return (
    <Pagination
      itemCount={itemCount}
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      perPageOptions={perPageOptions}
    />
  )
}

export { DeveloperAccountsPagination }
