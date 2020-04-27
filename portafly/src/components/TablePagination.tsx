import React, { FunctionComponent, useMemo, useReducer } from 'react'
import { Pagination, OnSetPage, OnPerPageSelect } from '@patternfly/react-core'

interface IPagination {
  itemCount: number
  state: PaginationState
  dispatch: React.Dispatch<PaginationAction>
}

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
]

const TablePagination: FunctionComponent<IPagination> = ({
  itemCount,
  state,
  dispatch
}) => {
  const { perPage, page } = state

  const onSetPage: OnSetPage = (ev, newPage, _perPage, startIdx, endIdx) => {
    dispatch({
      type: 'setPage',
      payload: {
        page: newPage,
        startIdx,
        endIdx
      }
    })
  }

  const onPerPageSelect: OnPerPageSelect = (ev, newPerPage, newPage, startIdx, endIdx) => {
    dispatch({
      type: 'setPerPage',
      payload: {
        page: newPage,
        perPage: newPerPage,
        startIdx,
        endIdx
      }
    })
  }

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

type PaginationState = {
  page: number
  perPage: number
  startIdx?: number
  endIdx?: number
}

type PaginationAction = {
  type: 'setPage' | 'setPerPage'
  payload: Partial<PaginationState>
}

const paginationReducer = (state: PaginationState, action: PaginationAction):
PaginationState => {
  switch (action.type) {
    case 'setPage':
    case 'setPerPage':
      return { ...state, ...action.payload }
    default:
      return { ...state }
  }
}

const usePaginationReducer = () => useReducer(paginationReducer, {
  page: 0,
  perPage: perPageOptions[0].value,
  startIdx: 0,
  endIdx: perPageOptions[0].value
})

export { TablePagination, usePaginationReducer }
