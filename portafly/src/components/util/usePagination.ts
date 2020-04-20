import { useState } from 'react'
import { OnSetPage, OnPerPageSelect } from '@patternfly/react-core'

export const usePagination = (defaultPerPage: number) => {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [pageIdx, setPageIdx] = useState({ startIdx: 0, endIdx: defaultPerPage })

  const onSetPage: OnSetPage = (ev, newPage, _perPage, startIdx, endIdx) => {
    setPage(newPage)
    setPageIdx({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  const onPerPageSelect: OnPerPageSelect = (ev, newPerPage, newPage, startIdx, endIdx) => {
    setPerPage(newPerPage)
    setPage(newPage)
    setPageIdx({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  return {
    page,
    perPage,
    pageIdx,
    onSetPage,
    onPerPageSelect
  }
}
