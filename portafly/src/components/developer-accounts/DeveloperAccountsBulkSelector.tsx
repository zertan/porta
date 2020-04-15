import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleCheckbox,
  DropdownItem
} from '@patternfly/react-core'
import { useTranslation } from 'i18n/useTranslation'

type IBulkSelector = {
  isChecked?: boolean
  onSelectAll: (selected: boolean) => void
  onSelectPage: (selected: boolean) => void
  pageCount: number,
  allCount: number,
  selectedCount: number
}

const BulkSelector: React.FunctionComponent<IBulkSelector> = ({
  isChecked, onSelectAll, onSelectPage, pageCount, allCount, selectedCount
}) => {
  const { t } = useTranslation('accounts')

  const [isOpen, setIsOpen] = useState(false)

  const onSelect = () => {
    setIsOpen((current) => !current)
  }

  const dropdownItems = [
    <DropdownItem key="0" component="button" onClick={() => onSelectAll(false)}>
      {t('accounts_table.data_toolbar.bulk_selector.none')}
    </DropdownItem>,
    <DropdownItem key="1" component="button" onClick={() => onSelectPage(true)}>
      {t('accounts_table.data_toolbar.bulk_selector.page', { count: pageCount })}
    </DropdownItem>,
    <DropdownItem key="2" component="button" onClick={() => onSelectAll(true)}>
      {t('accounts_table.data_toolbar.bulk_selector.all', { count: allCount })}
    </DropdownItem>
  ]

  return (
    <Dropdown
      isOpen={isOpen}
      id="checkbox_dropdown_id"
      dropdownItems={dropdownItems}
      onSelect={onSelect}
      toggle={(
        <DropdownToggle
          onToggle={setIsOpen}
          splitButtonItems={[
            <DropdownToggleCheckbox
              data-testid="developer-accounts-bulk-checkbox"
              id="developer-accounts-bulk-checkbox"
              isChecked={isChecked}
              onChange={onSelectAll}
              key="split-checkbox"
              aria-label="Select all"
            />
          ]}
        >
          {selectedCount > 0 ? t('accounts_table.data_toolbar.bulk_selector.label', { selectedCount }) : ''}
        </DropdownToggle>
      )}
    />
  )
}

export { BulkSelector as DeveloperAccountsBulkSelector }
