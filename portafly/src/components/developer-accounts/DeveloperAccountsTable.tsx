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
  SimpleEmptyState,
  CreateTableEmptyState,
  DeveloperAccountsBulkSelector,
  DeveloperAccountsSearchWidget,
  DeveloperAccountsActionsDropdown,
  DeveloperAccountsPagination
} from 'components'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'
import { Button } from '@patternfly/react-core'
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent
} from '@patternfly/react-core/dist/js/experimental'
import { SendEmailModal } from './SendEmailModal'
import { ChangePlanModal } from './ChangePlanModal'
import { ChangeStatusModal } from './ChangeStatusModal'

interface IDeveloperAccountsTable {
  accounts: IDeveloperAccount[]
}

const DeveloperAccountsTable: React.FunctionComponent<IDeveloperAccountsTable> = ({ accounts }) => {
  const { t } = useTranslation('accounts')

  if (accounts.length === 0) {
    return <SimpleEmptyState msg={t('accounts_table.empty_state')} />
  }

  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false)
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false)
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false)

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
    selected: false
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

  const [pageIdx, setPageIdx] = useState({ startIdx: 0, endIdx: 5 })

  const pagination = (
    <DeveloperAccountsPagination itemCount={filteredRows.length} onPageIdxChange={setPageIdx} />
  )

  const visibleRows = useMemo(
    () => filteredRows.slice(pageIdx.startIdx, pageIdx.endIdx),
    [rows, activeFilter, pageIdx]
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

  const onModalActionSelected = (action: 'email' | 'plan' | 'status') => {
    // eslint-disable-next-line default-case
    switch (action) {
      case 'email':
        setIsSendEmailModalOpen(true)
        break

      case 'plan':
        setIsChangePlanModalOpen(true)
        break

      case 'status':
        setIsChangeStatusModalOpen(true)
        break
    }
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
          <DeveloperAccountsBulkSelector
            onSelectAll={onSelectAll}
            onSelectPage={onSelectPage}
            pageCount={visibleRows.length}
            allCount={filteredRows.length}
            selectedCount={selectedCount}
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsActionsDropdown
            isDisabled={selectedCount === 0}
            onAction={onModalActionSelected}
          />
        </DataToolbarItem>
        <DataToolbarItem>
          <DeveloperAccountsSearchWidget onFilter={onFilter} />
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

      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        admins={selectedRows.map((r) => `${(r.cells as string[])[1]} (${(r.cells as string[])[0]})`)}
        onClose={() => setIsSendEmailModalOpen(false)}
        onSend={() => {}}
      />

      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (Plan)`)}
        onClose={() => setIsChangePlanModalOpen(false)}
        onSend={() => {}}
      />

      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        admins={selectedRows.map((r) => `${(r.cells as string[])[0]} (${(r.cells as string[])[4]})`)}
        onClose={() => setIsChangeStatusModalOpen(false)}
        onSend={() => {}}
      />
    </>
  )
}

export { DeveloperAccountsTable }
