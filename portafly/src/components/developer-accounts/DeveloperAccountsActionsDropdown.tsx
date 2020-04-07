import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownItem
} from '@patternfly/react-core'
import { CaretDownIcon } from '@patternfly/react-icons'
import { useTranslation } from 'i18n/useTranslation'

type IActionsDropdown = {

}

const ID_DROPDOWN = 'toggle-id-4'

const ActionsDropdown: React.FunctionComponent<IActionsDropdown> = () => {
  const { t } = useTranslation('accounts')
  const [isOpen, setIsOpen] = useState(false)

  const onFocus = () => document.getElementById(ID_DROPDOWN)?.focus()
  const onSelect = () => {
    setIsOpen(!isOpen)
    onFocus()
  }

  const toggle = (
    <DropdownToggle
      onToggle={setIsOpen}
      iconComponent={CaretDownIcon}
      isPrimary
      id={ID_DROPDOWN}
    >
      {t('accounts_table.data_toolbar.actions_dropdown.title')}
    </DropdownToggle>
  )

  const dropdownItems = [
    <DropdownItem key="action" component="button">{t('accounts_table.data_toolbar.actions_dropdown.action_0')}</DropdownItem>,
    <DropdownItem key="action" component="button">{t('accounts_table.data_toolbar.actions_dropdown.action_1')}</DropdownItem>
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
