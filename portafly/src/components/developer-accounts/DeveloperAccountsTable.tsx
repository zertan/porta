import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  IRow,
  OnSelect
} from '@patternfly/react-table'
import {
  TablePagination,
  usePaginationReducer,
  SimpleEmptyState,
  TableEmptyState
} from 'components'
import {
  BulkSelector,
  SearchWidget,
  SendEmailModal,
  ChangePlanModal,
  ChangeStateModal,
  ActionsDropdown,
  BulkAction,
  useDevAccountsTable
} from 'components/developer-accounts'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'
import { Button } from '@patternfly/react-core'
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent
} from '@patternfly/react-core/dist/js/experimental'

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

  /**
   * Modals region
   */
  const [visibleModal, setVisibleModal] = useState<BulkAction>()

  /**
   * Init table region
   */
  const { columns, initialRows } = useDevAccountsTable(accounts, isMultitenant)
  const [rows, setRows] = useState(initialRows)

  /**
   * Pagination Region
   */
  const [paginationState, dispatch] = usePaginationReducer()
  const { startIdx, endIdx } = paginationState

  /**
   * Filtering Region
   */
  type Filter = (row: IRow) => boolean
  const allInFilter: Filter = () => true
  const [activeFilter, setActiveFilter] = useState(() => allInFilter)

  const filteredRows = useMemo(() => rows.filter(activeFilter), [rows, activeFilter])

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

  const visibleRows = useMemo(
    () => filteredRows.slice(startIdx, endIdx),
    [rows, activeFilter, startIdx, endIdx]
  )

  /**
   * Selection Region
   */
  const selectedRows = rows.filter((r) => Boolean(r.selected))
  const selectedCount = selectedRows.length

  const onSelectOne: OnSelect = (_ev, isSelected, _rowIndex, rowData) => {
    const newRows = [...rows]
    const selectedRow = newRows.find((row) => row.key === rowData.key) as IRow
    selectedRow.selected = isSelected

    setRows(newRows)
  }

  const onSelectPage = (isSelected: boolean) => {
    const newRows = [...initialRows]
    visibleRows.forEach((vR) => {
      const selectedRow = newRows.find((nR) => vR.key === nR.key) as IRow
      selectedRow.selected = isSelected
    })
    setRows(newRows)
  }

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

  /**
   * Helper components definition Region
   */
  const pagination = (
    <TablePagination
      itemCount={filteredRows.length}
      state={paginationState}
      dispatch={dispatch}
    />
  )

  const searchEmptyState = [{
    heightAuto: true,
    cells: [{
      props: { colSpan: 8 },
      title: <TableEmptyState
        title={t('accounts_table.empty_state_title')}
        body={t('accounts_table.empty_state_body')}
        button={<Button variant="link" onClick={clearFilters}>{t('accounts_table.empty_state_button')}</Button>}
      />
    }]
  }]

  const dataToolbar = (
    <DataToolbar id="accounts-toolbar-top" clearAllFilters={() => console.log('clear all')}>
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
    </DataToolbar>
  )

  return (
    <>
      <Table
        aria-label={t('accounts_table.aria_label')}
        header={dataToolbar}
        cells={columns}
        rows={visibleRows.length ? visibleRows : searchEmptyState}
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
          admins={selectedRows.map((r) => `${(r.cells as string[])[1]} (${(r.cells as string[])[0]})`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}

      {visibleModal === 'changePlan' && (
        <ChangePlanModal
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (Plan)`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}

      {visibleModal === 'changeState' && (
        <ChangeStateModal
          admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (${(r.cells as string[])[4]})`)}
          onClose={() => setVisibleModal(undefined)}
        />
      )}
    </>
  )
}

export { DeveloperAccountsTable }
