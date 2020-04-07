import React, { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  OnSort,
  IRow,
  ICell
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
import { DeveloperAccountsCheckboxDropdown } from './DeveloperAccountsCheckboxDropdown'
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

  const rows: IRow[] = accounts.map((a) => ({
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

  const onSort: OnSort = () => {
    // TODO
    setSortBy({})
  }

  const onSetPage: OnSetPage = (_ev, newPage) => {
    // TODO
    setPage(newPage)
  }

  const onSelect = () => {
    // TODO
  }

  const dataToolbarItems = (
    <>
      <span id="page-layout-table-column-management-action-toolbar-top-select-checkbox-label" hidden>Choose one</span>
      <DataToolbarContent>
        <DataToolbarItem>
          <DeveloperAccountsCheckboxDropdown />
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
            perPage={10}
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
        onSelect={onSelect}
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
              perPage={10}
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
