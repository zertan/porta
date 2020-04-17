import React, { useState, useMemo } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core'
import { CaretDownIcon, WarningTriangleIcon } from '@patternfly/react-icons'
import { useTranslation } from 'i18n/useTranslation'

type IActionsDropdown = {
  isDisabled?: boolean
  onAction: (action: 'email'|'plan'|'status') => void
}

const ActionsDropdown: React.FunctionComponent<IActionsDropdown> = ({
  isDisabled = false,
  onAction
}) => {
  const { t } = useTranslation('accounts')

  const [isOpen, setIsOpen] = useState(false)

  const toggle = (
    <DropdownToggle onToggle={setIsOpen} iconComponent={CaretDownIcon} isPrimary>
      {t('accounts_table.data_toolbar.bulk_actions.title')}
    </DropdownToggle>
  )

  const warning = [
    // TODO: add proper styling / use proper PF component
    <DropdownItem key="warning" isDisabled>
      <TextContent>
        <WarningTriangleIcon />
        <Text component={TextVariants.small}>
          {t('accounts_table.data_toolbar.bulk_actions.warning')}
        </Text>
      </TextContent>
    </DropdownItem>,
    <DropdownSeparator key="separator" />
  ]

  const dropdownItems = useMemo(() => [
    ...(isDisabled ? warning : []),
    <DropdownItem
      key="0"
      component="button"
      isDisabled={isDisabled}
      onClick={() => onAction('email')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.send_email')}
    </DropdownItem>,
    <DropdownItem
      key="1"
      component="button"
      isDisabled={isDisabled}
      onClick={() => onAction('plan')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.change_plan')}
    </DropdownItem>,
    <DropdownItem
      key="2"
      component="button"
      isDisabled={isDisabled}
      onClick={() => onAction('status')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.change_status')}
    </DropdownItem>
  ], [isDisabled])

  return (
    <Dropdown
      onSelect={() => setIsOpen(!isOpen)}
      toggle={toggle}
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  )
}

export { ActionsDropdown as DeveloperAccountsActionsDropdown }
