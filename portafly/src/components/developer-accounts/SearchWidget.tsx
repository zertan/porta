import React, { useState, useRef } from 'react'
import {
  SelectOption,
  Select,
  SelectVariant,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  SelectOptionObject
} from '@patternfly/react-core'
import { FilterIcon, SearchIcon } from '@patternfly/react-icons'
import { useTranslation } from 'i18n/useTranslation'
import { DataToolbarFilter, DataToolbarGroup, DataToolbarChip } from '@patternfly/react-core/dist/js/experimental'

interface ISearch {
  onFilter: (term: string, filterBy: string) => void
}

const SearchWidget: React.FunctionComponent<ISearch> = ({ onFilter }) => {
  const { t } = useTranslation('accounts')

  const group = t('accounts_table.col_group')
  const admin = t('accounts_table.col_admin')
  const state = t('accounts_table.col_state')
  const options = [group, admin, state]

  const [isExpanded, setIsExpanded] = useState(false)
  const [filterBy, setFilterBy] = useState(options[0])
  const [term, setTerm] = useState('')
  const textInputRef = useRef<HTMLInputElement>(null)

  const onSelectCategory = (_: any, value: string | SelectOptionObject) => {
    setFilterBy(value as string)
    setIsExpanded(!isExpanded)

    textInputRef.current?.focus()
  }

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onFilter(term, filterBy)
    }
  }

  const [isStateSelectOpen, setIsStateSelectOpen] = useState(false)
  const [chips, setChips] = useState<Record<string, string[]>>({
    [group]: [],
    [admin]: [],
    [state]: []
  })

  const onSelectState = (ev: any, selection: string | SelectOptionObject) => {
    const { checked } = ev.currentTarget as HTMLInputElement
    const newStateChips = checked
      ? [...chips[state], selection as string]
      : chips[state].filter((s) => s !== selection)

    setChips({ ...chips, [state]: newStateChips })
  }

  const removeSelection = (category: string, chip: string | DataToolbarChip) => {
    const newCategoryChips = chips[category].filter((s) => s !== chip)
    setChips({ ...chips, [category]: newCategoryChips })
  }

  return (
    <DataToolbarGroup variant="filter-group">
      <Select
        toggleIcon={<FilterIcon />}
        variant={SelectVariant.single}
        aria-label={t('accounts_table.data_toolbar.search_widget.select_aria_label')}
        onToggle={setIsExpanded}
        onSelect={onSelectCategory}
        selections={filterBy}
        isExpanded={isExpanded}
        ariaLabelledBy="title-id"
        isDisabled={false}
      >
        {options.map((o) => <SelectOption key={o} value={o} />)}
      </Select>
      <DataToolbarFilter chips={chips[group]} deleteChip={removeSelection} categoryName={group}>
        {filterBy === group && (
          <InputGroup>
            <TextInput
              ref={textInputRef}
              type="search"
              aria-label={t('accounts_table.data_toolbar.search_widget.text_input_aria_label')}
              placeholder={t('accounts_table.data_toolbar.search_widget.placeholder', { option: filterBy.toLowerCase() })}
              value={term}
              onChange={setTerm}
              onKeyUp={onKeyUp}
            />
            <Button
              variant={ButtonVariant.control}
              aria-label={t('accounts_table.data_toolbar.search_widget.button_aria_label')}
              onClick={() => onFilter(term, filterBy)}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        )}
      </DataToolbarFilter>
      <DataToolbarFilter chips={chips[admin]} deleteChip={removeSelection} categoryName={admin}>
        {filterBy === admin && (
          <InputGroup>
            <TextInput
              ref={textInputRef}
              type="search"
              aria-label={t('accounts_table.data_toolbar.search_widget.text_input_aria_label')}
              placeholder={t('accounts_table.data_toolbar.search_widget.placeholder', { option: filterBy.toLowerCase() })}
              value={term}
              onChange={setTerm}
              onKeyUp={onKeyUp}
            />
            <Button
              variant={ButtonVariant.control}
              aria-label={t('accounts_table.data_toolbar.search_widget.button_aria_label')}
              onClick={() => onFilter(term, filterBy)}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        )}
      </DataToolbarFilter>
      <DataToolbarFilter chips={chips[state]} deleteChip={removeSelection} categoryName={state}>
        {filterBy === state && (
          <Select
            variant={SelectVariant.checkbox}
            aria-label="Status"
            onToggle={() => setIsStateSelectOpen(!isStateSelectOpen)}
            onSelect={onSelectState}
            selections={chips[state]}
            isExpanded={isStateSelectOpen}
            placeholderText="Status"
          >
            <SelectOption key="approved" value="Approved" />
            <SelectOption key="pending" value="Pending" />
            <SelectOption key="rejected" value="Rejected" />
            <SelectOption key="suspended" value="Suspended" />
          </Select>
        )}
      </DataToolbarFilter>
    </DataToolbarGroup>
  )
}

export { SearchWidget }
