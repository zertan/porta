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
  onAction: (action: 'email'|'plan'|'status') => void
}

const ActionsDropdown: React.FunctionComponent<IActionsDropdown> = ({
  isDisabled, onAction
}) => {
  const { t } = useTranslation('accounts')

  const [isOpen, setIsOpen] = useState(false)

  const onSelect = () => setIsOpen(!isOpen)

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
    <DropdownItem key="0" component="button" onClick={() => onAction('email')}>{t('accounts_table.data_toolbar.bulk_actions.send_email')}</DropdownItem>,
    <DropdownItem key="1" component="button" onClick={() => onAction('plan')}>{t('accounts_table.data_toolbar.bulk_actions.change_plan')}</DropdownItem>,
    <DropdownItem key="2" component="button" onClick={() => onAction('status')}>{t('accounts_table.data_toolbar.bulk_actions.change_status')}</DropdownItem>
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
