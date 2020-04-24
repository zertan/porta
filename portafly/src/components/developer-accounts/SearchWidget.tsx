import React, { useState, useRef, useMemo } from 'react'
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

import './searchWidget.scss'

interface ISearch {
  filters: Record<string, string[] | undefined>,
  onFiltersChange: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

const SearchWidget: React.FunctionComponent<ISearch> = ({
  filters,
  onFiltersChange
}) => {
  const { t } = useTranslation('accounts')

  const group = t('accounts_table.col_group')
  const admin = t('accounts_table.col_admin')
  const state = t('accounts_table.col_state')
  const categories = [group, admin, state]

  const [isCategorySelectExpanded, setIsCategorySelectExpanded] = useState(false)
  const [isStateSelectExpanded, setIsStateSelectExpanded] = useState(false)
  const [filterBy, setFilterBy] = useState(categories[0])
  const textInputRef = useRef<HTMLInputElement>(null)

  const onSelectCategory = (_: any, value: string | SelectOptionObject) => {
    setFilterBy(value as string)
    setIsCategorySelectExpanded(false)

    textInputRef.current?.focus()
  }

  // TODO: prevent adding the same term twice for categories: group and admin
  const addChip = (category: string, term: string) => {
    onFiltersChange((prevFilters) => {
      const prevCatChips = prevFilters[category] || []
      const newCategoryChips = [...prevCatChips, term]
      return { ...prevFilters, [category]: newCategoryChips }
    })
  }

  const removeSelection = (category: string, filter: string | DataToolbarChip) => {
    onFiltersChange((prevFilters) => {
      const newCategoryChips = prevFilters[category]?.filter((s) => s !== filter)
      return { ...prevFilters, [category]: newCategoryChips }
    })
  }

  const onSelectState = (ev: any, selection: string | SelectOptionObject) => {
    const { checked } = ev.currentTarget as HTMLInputElement

    if (checked) {
      addChip(state, selection as string)
    } else {
      removeSelection(state, selection as string)
    }
  }

  const onClick = () => {
    if (textInputRef.current?.value) {
      addChip(filterBy, textInputRef.current.value)
      textInputRef.current.value = ''
    }
  }

  const dataToolbarFilters = useMemo(() => categories.map((o) => (
    <DataToolbarFilter
      key={o}
      chips={filters[o]}
      deleteChip={removeSelection}
      categoryName={o}
    >
      <span />
    </DataToolbarFilter>
  )), [filters])


  const searchBar = (
    <InputGroup>
      <TextInput
        ref={textInputRef}
        type="search"
        aria-label={t('accounts_table.data_toolbar.search_widget.text_input_aria_label')}
        placeholder={t('accounts_table.data_toolbar.search_widget.placeholder', { option: filterBy.toLowerCase() })}
        onKeyUp={(ev) => ev.key === 'Enter' && onClick()}
      />
      <Button
        variant={ButtonVariant.control}
        aria-label={t('accounts_table.data_toolbar.search_widget.button_aria_label')}
        onClick={onClick}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  )

  const stateSelect = (
    <Select
      variant={SelectVariant.checkbox}
      aria-label={t('accounts_table.data_toolbar.search_widget.select_state_aria_label')}
      onSelect={onSelectState}
      selections={filters[state]}
      isExpanded={isStateSelectExpanded}
      onToggle={setIsStateSelectExpanded}
      placeholderText={t('accounts_table.data_toolbar.search_widget.placeholder', { option: filterBy.toLowerCase() })}
    >
      <SelectOption key="approved" value="Approved" />
      <SelectOption key="pending" value="Pending" />
      <SelectOption key="rejected" value="Rejected" />
      <SelectOption key="suspended" value="Suspended" />
    </Select>
  )

  return (
    <DataToolbarGroup variant="filter-group">
      <Select
        toggleIcon={<FilterIcon />}
        variant={SelectVariant.single}
        aria-label={t('accounts_table.data_toolbar.search_widget.select_aria_label')}
        onSelect={onSelectCategory}
        selections={filterBy}
        isExpanded={isCategorySelectExpanded}
        onToggle={setIsCategorySelectExpanded}
        ariaLabelledBy="title-id"
        isDisabled={false}
      >
        {categories.map((o) => <SelectOption key={o} value={o} />)}
      </Select>
      {dataToolbarFilters}
      {filterBy === state ? stateSelect : searchBar}
    </DataToolbarGroup>
  )
}

export { SearchWidget }
