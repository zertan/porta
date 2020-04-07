import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleCheckbox,
  DropdownItem
} from '@patternfly/react-core'
import { useTranslation } from 'i18n/useTranslation'

type ICheckboxDropdown = {

}

const ID_DROPDOWN = 'checkbox_dropdown_id'

const CheckboxDropdown: React.FunctionComponent<ICheckboxDropdown> = () => {
  const { t } = useTranslation('accounts')

  const [isOpen, setIsOpen] = useState(false)

  const onFocus = () => document.getElementById(ID_DROPDOWN)?.focus()
  const onSelect = () => {
    // TODO
    setIsOpen(!isOpen)
    onFocus()
  }

  const dropdownItems = [
    <DropdownItem key="action" component="button">{t('accounts_table.data_toolbar.bulk_dropdown.action_0')}</DropdownItem>,
    <DropdownItem key="action" component="button">{t('accounts_table.data_toolbar.bulk_dropdown.action_1')}</DropdownItem>
  ]

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={(
        <DropdownToggle
          splitButtonItems={[
            <DropdownToggleCheckbox id="example-checkbox-1" key="split-checkbox" aria-label="Select all" />
          ]}
          onToggle={setIsOpen}
          id={ID_DROPDOWN}
        />
      )}
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  )
}

export { CheckboxDropdown as DeveloperAccountsCheckboxDropdown }
