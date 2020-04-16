import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownItem
} from '@patternfly/react-core'
import { CaretDownIcon } from '@patternfly/react-icons'
import { useTranslation } from 'i18n/useTranslation'

type IActionsDropdown = {
  isDisabled: boolean
}

const ActionsDropdown: React.FunctionComponent<IActionsDropdown> = ({ isDisabled }) => {
  const { t } = useTranslation('accounts')

  const [isOpen, setIsOpen] = useState(false)

  const onSelect = () => setIsOpen(!isOpen)

  const onSendEmail = () => {
    // TODO
  }

  const onChangePlan = () => {
    // TODO
  }

  const onChangeStatus = () => {
    // TODO
  }

  const toggle = (
    <DropdownToggle
      onToggle={setIsOpen}
      iconComponent={CaretDownIcon}
      isPrimary
      isDisabled={isDisabled}
    >
      {t('accounts_table.data_toolbar.bulk_actions.title')}
    </DropdownToggle>
  )

  const dropdownItems = [
    <DropdownItem key="send_email" component="button" onClick={onSendEmail}>{t('accounts_table.data_toolbar.bulk_actions.send_email')}</DropdownItem>,
    <DropdownItem key="change_plan" component="button" onClick={onChangePlan}>{t('accounts_table.data_toolbar.bulk_actions.change_plan')}</DropdownItem>,
    <DropdownItem key="change_status" component="button" onClick={onChangeStatus}>{t('accounts_table.data_toolbar.bulk_actions.change_status')}</DropdownItem>
  ]

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={toggle}
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  )
}

export { ActionsDropdown as DeveloperAccountsActionsDropdown }
