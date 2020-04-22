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
  BulkAction
} from 'components/developer-accounts'
import { useAlertsContext } from 'components/util'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'
import { Button } from '@patternfly/react-core'
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent
} from '@patternfly/react-core/dist/js/experimental'
import { sendEmail, changePlan, changeState } from 'dal/accounts/bulkActions'

interface IDeveloperAccountsTable {
  accounts: IDeveloperAccount[]
}

const DeveloperAccountsTable: React.FunctionComponent<IDeveloperAccountsTable> = ({ accounts }) => {
  const { t } = useTranslation('accounts')
  const { addAlert } = useAlertsContext()

  if (accounts.length === 0) {
    return <SimpleEmptyState msg={t('accounts_table.empty_state')} />
  }

  const [visibleModal, setVisibleModal] = useState<BulkAction>()

  const columns: ICell[] = [
    {
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
    },
    {
      title: t('accounts_table.col_apps'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_state'),
      transforms: [sortable]
    },
    {
      title: t('accounts_table.col_actions')
    }
  ]

  const initialRows: Array<IRow & { key: string }> = accounts.map((a) => ({
    key: String(a.id),
    // Order of cells must match the columns
    cells: [
      a.org_name,
      a.admin_name,
      a.created_at,
      a.apps_count.toString(),
      a.state,
      {
        // TODO: implement this button
        title: <Button variant="link">Impersonate</Button>
      }
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
          onSubmit={() => {
            setVisibleModal(undefined)
            const start = t('toasts.send_email_start')
            const success = t('toasts.send_email_success')
            const error = t('toasts.send_email_error')
            addAlert({ key: Date.now().toString(), variant: 'info', title: start })
            sendEmail()
              .then(() => addAlert({ key: Date.now().toString(), variant: 'success', title: success }))
              .catch(() => addAlert({ key: Date.now().toString(), variant: 'danger', title: error }))
          }}
        />
      )}

      {visibleModal === 'changePlan' && (
        <ChangePlanModal
          isOpen
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (Plan)`)}
          onClose={() => setVisibleModal(undefined)}
          onSubmit={() => {
            setVisibleModal(undefined)
            const start = t('toasts.change_plan_start')
            const success = t('toasts.change_plan_success')
            const error = t('toasts.change_plan_error')
            addAlert({ key: Date.now().toString(), variant: 'info', title: start })
            changePlan()
              .then(() => addAlert({ key: Date.now().toString(), variant: 'success', title: success }))
              .catch(() => addAlert({ key: Date.now().toString(), variant: 'danger', title: error }))
          }}
        />
      )}

      {visibleModal === 'changeState' && (
        <ChangeStateModal
          isOpen
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (${(r.cells as string[])[4]})`)}
          onClose={() => setVisibleModal(undefined)}
          onSubmit={() => {
            setVisibleModal(undefined)
            const start = t('toasts.change_state_start')
            const success = t('toasts.change_state_success')
            const error = t('toasts.change_state_error')
            addAlert({ key: Date.now().toString(), variant: 'info', title: start })
            changeState()
              .then(() => addAlert({ key: Date.now().toString(), variant: 'success', title: success }))
              .catch(() => addAlert({ key: Date.now().toString(), variant: 'danger', title: error }))
          }}
        />
      )}
    </>
  )
}

export { DeveloperAccountsTable }
