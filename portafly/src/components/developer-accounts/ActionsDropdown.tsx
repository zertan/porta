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

export type BulkAction = 'sendEmail' | 'changePlan' | 'changeState'

interface IActionsDropdown {
  isDisabled?: boolean
  selectAction: (action: BulkAction) => void
}

const ActionsDropdown: React.FunctionComponent<IActionsDropdown> = ({
  isDisabled = false,
  selectAction
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
      onClick={() => selectAction('sendEmail')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.send_email')}
    </DropdownItem>,
    <DropdownItem
      key="1"
      component="button"
      isDisabled={isDisabled}
      onClick={() => selectAction('changePlan')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.change_plan')}
    </DropdownItem>,
    <DropdownItem
      key="2"
      component="button"
      isDisabled={isDisabled}
      onClick={() => selectAction('changeState')}
    >
      {t('accounts_table.data_toolbar.bulk_actions.change_state')}
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

export { ActionsDropdown }
