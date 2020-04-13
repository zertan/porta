import React, { useState } from 'react'
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
  OnSetPage
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
  const [page, setPage] = useState(0)
  const perPage = 10
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

  const initialRows: IRow[] = accounts.map((a) => ({
    key: a.id,
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

  const onSetPage: OnSetPage = (_ev, newPage) => {
    // TODO
    setPage(newPage)
  }

  const onSelectAll = (selected: boolean = true) => {
    const newRows = rows.map((r) => ({ ...r, selected }))
    setRows(newRows)
    setIsAllSelected(selected)
  }

  const onSelectPage = (selected: boolean) => {
    // TODO: when implemented pagination/filtering
    console.log(selected)
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
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsActionsDropdown />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsSearchWidget options={FILTERABLE_COLS} />
        </DataToolbarItem>
        <DataToolbarItem variant="pagination" breakpointMods={[{ modifier: 'align-right', breakpoint: 'md' }]}>
          <Pagination
            itemCount={accounts.length}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
          />
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
        rows={rows}
        onSelect={onSelectOne}
        canSelectAll={false}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <DataToolbar id="footer">
        <DataToolbarContent>
          <DataToolbarItem variant="pagination" breakpointMods={[{ modifier: 'align-right', breakpoint: 'md' }]}>
            <Pagination
              itemCount={accounts.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
            />
          </DataToolbarItem>
        </DataToolbarContent>
      </DataToolbar>
    </>
  )
}

export { DeveloperAccountsTable }
