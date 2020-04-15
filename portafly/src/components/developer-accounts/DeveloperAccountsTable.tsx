import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  OnSort,
  ICell,
  IRow,
  OnSelect
} from '@patternfly/react-table'
import { SimpleEmptyState } from 'components'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'
import {
  Pagination,
  OnSetPage,
  OnPerPageSelect
} from '@patternfly/react-core'
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent
} from '@patternfly/react-core/dist/js/experimental'
import { DeveloperAccountsActionsDropdown } from './DeveloperAccountsActionsDropdown'
import { DeveloperAccountsBulkSelector } from './DeveloperAccountsBulkSelector'
import { DeveloperAccountsSearchWidget } from './DeveloperAccountsSearchWidget'

export interface IDeveloperAccountsTable {
  accounts: IDeveloperAccount[]
}

const DeveloperAccountsTable: React.FunctionComponent<IDeveloperAccountsTable> = ({ accounts }) => {
  const { t } = useTranslation('accounts')

  if (accounts.length === 0) {
    return <SimpleEmptyState msg={t('accounts_table.empty_state')} />
  }

  const [sortBy, setSortBy] = useState({})
  const [isAllSelected, setIsAllSelected] = useState(false)

  const FILTERABLE_COLS = [
    t('accounts_table.col_group'),
    t('accounts_table.col_admin'),
    t('accounts_table.col_signup'),
    t('accounts_table.col_apps'),
    t('accounts_table.col_state')
  ]

  const COLUMNS: ICell[] = [
    ...FILTERABLE_COLS.map((c) => ({ title: c, transforms: [sortable] })),
    t('accounts_table.col_actions')
  ]

  const initialRows: Array<IRow & { key: string }> = accounts.map((a) => ({
    key: String(a.id),
    cells: [
      a.org_name,
      a.admin_name,
      a.created_at,
      a.apps_count.toString(),
      a.state,
      ''
    ],
    selected: false
  }))
  const [rows, setRows] = useState(initialRows)

  const onSort: OnSort = () => {
    // TODO
    setSortBy({})
  }

  const onSelectAll = (selected: boolean = true) => {
    const newRows = rows.map((r) => ({ ...r, selected }))
    setRows(newRows)
    setIsAllSelected(selected)
  }

  const onSelectOne: OnSelect = (_ev, isSelected, _rowIndex, rowData) => {
    if (!isSelected && isAllSelected) {
      setIsAllSelected(false)
    }

    const newRows = [...rows]
    const selectedRow = newRows.find((row) => row.key === rowData.key) as IRow
    selectedRow.selected = isSelected

    setRows(newRows)
  }

  const perPageOptions = [
    { title: '5', value: 5 },
    { title: '20', value: 20 },
    { title: '50', value: 50 }
  ]
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(perPageOptions[0].value)
  const [pageIdx, setPageIdx] = useState({ startIdx: 0, endIdx: perPageOptions[0].value })
  const onSetPage: OnSetPage = (ev, newPage, _perPage, startIdx, endIdx) => {
    setPage(newPage)
    setPageIdx({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  const onPerPageSelect: OnPerPageSelect = (ev, newPerPage, newPage, startIdx, endIdx) => {
    setPerPage(newPerPage)
    setPageIdx({ startIdx: startIdx as number, endIdx: endIdx as number })
  }

  const pagination = (
    <Pagination
      itemCount={accounts.length}
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      perPageOptions={perPageOptions}
    />
  )

  const visibleRows = useMemo(() => rows.slice(pageIdx.startIdx, pageIdx.endIdx), [rows, pageIdx])

  const onSelectPage = (isSelected: boolean) => {
    const newRows = [...initialRows]
    visibleRows.forEach((vR) => {
      const selectedRow = newRows.find((nR) => vR.key === nR.key) as IRow
      selectedRow.selected = isSelected
    })
    setRows(newRows)
  }

  const selectedCount = rows.reduce((count, row) => count + (row.selected ? 1 : 0), 0)

  const dataToolbarItems = (
    <>
      <span id="page-layout-table-column-management-action-toolbar-top-select-checkbox-label" hidden>Choose one</span>
      <DataToolbarContent>
        <DataToolbarItem>
          <DeveloperAccountsBulkSelector
            onSelectAll={onSelectAll}
            onSelectPage={onSelectPage}
            isChecked={isAllSelected}
            pageCount={Math.min(accounts.length, perPage)}
            allCount={accounts.length}
            selectedCount={selectedCount}
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsActionsDropdown />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsSearchWidget options={FILTERABLE_COLS} />
        </DataToolbarItem>
        <DataToolbarItem variant="pagination" breakpointMods={[{ modifier: 'align-right', breakpoint: 'md' }]}>
          {pagination}
        </DataToolbarItem>
      </DataToolbarContent>
    </>
  )

  return (
    <>
      <Table
        aria-label={t('accounts_table.aria_label')}
        header={<DataToolbar id="accounts-toolbar-top">{dataToolbarItems}</DataToolbar>}
        sortBy={sortBy}
        onSort={onSort}
        cells={COLUMNS}
        rows={visibleRows}
        onSelect={onSelectOne}
        canSelectAll={false}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <DataToolbar id="footer">
        <DataToolbarContent>
          <DataToolbarItem variant="pagination" breakpointMods={[{ modifier: 'align-right', breakpoint: 'md' }]}>
            {pagination}
          </DataToolbarItem>
        </DataToolbarContent>
      </DataToolbar>
    </>
  )
}

export { DeveloperAccountsTable }
