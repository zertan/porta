import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  ICell,
  IRow,
  OnSelect
} from '@patternfly/react-table'
import {
  TablePagination,
  usePaginationReducer,
  SimpleEmptyState,
  CreateTableEmptyState
} from 'components'
import {
  BulkSelector,
  SearchWidget,
  SendEmailModal,
  ChangePlanModal,
  ChangeStateModal,
  ActionsDropdown,
  BulkAction,
  ActionButtonImpersonate
} from 'components/developer-accounts'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'
import { Button } from '@patternfly/react-core'
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent
} from '@patternfly/react-core/dist/js/experimental'
import { CheckIcon, PlayCircleIcon } from '@patternfly/react-icons'

interface IDeveloperAccountsTable {
  accounts: IDeveloperAccount[]
  isMultitenant?: boolean
}

const DeveloperAccountsTable: React.FunctionComponent<IDeveloperAccountsTable> = ({
  accounts,
  isMultitenant = false
}) => {
  const { t } = useTranslation('accounts')

  if (accounts.length === 0) {
    return <SimpleEmptyState msg={t('accounts_table.empty_state')} />
  }

  const [visibleModal, setVisibleModal] = useState<BulkAction>()

  const columns: ICell[] = [
    ...[{
      title: t('accounts_table.col_group'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_admin'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_signup'),
      transforms: [sortable]
    }],
    // Add this column only when PAID
    ...accounts[0].plan ? [{
      title: t('accounts_table.col_plan'),
      transforms: [sortable]
    }] : [],
    ...[{
      title: t('accounts_table.col_apps'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_state'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_actions')
    }]
  ]

  const buttons = [
    <Button variant="link" icon={<CheckIcon />}>{t('accounts_table.actions.approve')}</Button>,
    <Button variant="link" icon={<PlayCircleIcon />}>{t('accounts_table.actions.activate')}</Button>
  ]

  const initialRows: Array<IRow & { key: string }> = accounts.map((a, i) => ({
    key: String(a.id),
    // Order of cells must match the columns
    cells: [
      ...[
        a.org_name,
        a.admin_name,
        a.created_at
      ],
      ...a.plan ? [a.plan] : [],
      ...[
        a.apps_count.toString(),
        a.state,
        {
          // TODO: where does isMultitenant come from
          // TODO: how to decide wether approve or activate
          title: isMultitenant ? <ActionButtonImpersonate /> : buttons[i % 2]
        }
      ]
    ],
    selected: true
  }))

  const [rows, setRows] = useState(initialRows)

  type Filter = (row: IRow) => boolean
  const allInFilter: Filter = () => true
  const allSelectedFilter: Filter = (r) => (r.selected as boolean)
  const [activeFilter, setActiveFilter] = useState(() => allInFilter)

  const filteredRows = useMemo(() => rows.filter(activeFilter), [rows, activeFilter])

  const onSelectAll = (selected: boolean = true) => {
    let newRows: (typeof initialRows)

    if (!selected) {
      newRows = [...initialRows]
    } else if (filteredRows.length === initialRows.length) {
      newRows = initialRows.map((nR) => ({ ...nR, selected: true }))
    } else {
      newRows = [...initialRows]
      filteredRows.forEach((fR) => {
        const selectedRow = newRows.find((nR) => fR.key === nR.key) as IRow
        selectedRow.selected = true
      })
      setRows(newRows)
    }

    setRows(newRows)
  }

  const onSelectOne: OnSelect = (_ev, isSelected, _rowIndex, rowData) => {
    const newRows = [...rows]
    const selectedRow = newRows.find((row) => row.key === rowData.key) as IRow
    selectedRow.selected = isSelected

    setRows(newRows)
  }

  const [paginationState, dispatch] = usePaginationReducer()
  const { startIdx, endIdx } = paginationState

  const pagination = (
    <TablePagination
      itemCount={filteredRows.length}
      state={paginationState}
      dispatch={dispatch}
    />
  )

  const visibleRows = useMemo(
    () => filteredRows.slice(startIdx, endIdx),
    [rows, activeFilter, startIdx, endIdx]
  )

  const onSelectPage = (isSelected: boolean) => {
    const newRows = [...initialRows]
    visibleRows.forEach((vR) => {
      const selectedRow = newRows.find((nR) => vR.key === nR.key) as IRow
      selectedRow.selected = isSelected
    })
    setRows(newRows)
  }

  const selectedRows = rows.filter(allSelectedFilter)
  const selectedCount = selectedRows.length

  const onFilter = (term: string) => {
    let newFilter: Filter

    if (term === '') {
      newFilter = allInFilter
    } else {
      // TODO: do actual filtering
      newFilter = allInFilter
    }

    setActiveFilter(() => newFilter)
  }

  const clearFilters = () => setActiveFilter(() => allInFilter)

  const tableEmptyStateRow = useMemo(() => CreateTableEmptyState(
    t('accounts_table.empty_state_title'),
    t('accounts_table.empty_state_body'),
    <Button variant="link" onClick={clearFilters}>{t('accounts_table.empty_state_button')}</Button>
  ), [t])

  const dataToolbarItems = (
    <>
      <DataToolbarContent>
        <DataToolbarItem>
          <BulkSelector
            onSelectAll={onSelectAll}
            onSelectPage={onSelectPage}
            pageCount={visibleRows.length}
            allCount={filteredRows.length}
            selectedCount={selectedCount}
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <ActionsDropdown
            isDisabled={selectedCount === 0}
            selectAction={setVisibleModal}
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <SearchWidget onFilter={onFilter} />
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
        cells={columns}
        rows={visibleRows.length ? visibleRows : tableEmptyStateRow}
        onSelect={visibleRows.length ? onSelectOne : undefined}
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

      {visibleModal === 'sendEmail' && (
        <SendEmailModal
          isOpen
          admins={selectedRows.map((r) => `${(r.cells as string[])[1]} (${(r.cells as string[])[0]})`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}

      {visibleModal === 'changePlan' && (
        <ChangePlanModal
          isOpen
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (Plan)`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}

      {visibleModal === 'changeState' && (
        <ChangeStateModal
          isOpen
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (${(r.cells as string[])[4]})`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}
    </>
  )
}

export { DeveloperAccountsTable }
