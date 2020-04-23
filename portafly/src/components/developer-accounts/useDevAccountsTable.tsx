import React, { useMemo } from 'react'
import { Button } from '@patternfly/react-core'
import { ICell, sortable, IRow } from '@patternfly/react-table'
import { CheckIcon, PlayCircleIcon } from '@patternfly/react-icons'
import { ActionButtonImpersonate } from 'components/developer-accounts'
import { IDeveloperAccount } from 'types'
import { useTranslation } from 'i18n/useTranslation'

const useDevAccountsTable = (accounts: IDeveloperAccount[], isMultitenant = false) => {
  const { t } = useTranslation('accounts')

  return useMemo(() => {
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
      // Add this column only when PAID?
      ...accounts[0].plan !== undefined ? [{
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

    // Rows and Columns must have the same order
    const mapAccountToRowCell = (account: IDeveloperAccount) => [
      ...[
        account.org_name,
        account.admin_name,
        account.created_at
      ],
      ...account.plan ? [account.plan] : [],
      ...[
        account.apps_count.toString(),
        account.state,
        {
          // TODO: where does isMultitenant come from
          // TODO: how to decide wether approve or activate
          title: isMultitenant ? <ActionButtonImpersonate /> : buttons[Date.now() % 2]
        }
      ]
    ]

    const initialRows: Array<IRow & { key: string }> = accounts.map((a) => ({
      key: String(a.id),
      cells: mapAccountToRowCell(a),
      selected: false
    }))

    return { columns, initialRows }
  }, [accounts])
}

export { useDevAccountsTable }
