import React, { useState } from 'react'
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

type ISearch = {
  options: Array<string>,
  onFilter: (term: string, filterBy: string) => void
}

const Search: React.FunctionComponent<ISearch> = ({ options, onFilter }) => {
  const { t } = useTranslation('accounts')

  const [isExpanded, setIsExpanded] = useState(false)
  const [filterBy, setFilterBy] = useState(options[0])
  const [term, setTerm] = useState('')

  const onSelect = (_: any, value: string | SelectOptionObject) => {
    setFilterBy(value as string)
    setIsExpanded(!isExpanded)
  }

  return (
    <InputGroup>
      <Select
        toggleIcon={<FilterIcon />}
        variant={SelectVariant.single}
        aria-label={t('accounts_table.data_toolbar.search_widget.select_aria_label')}
        onToggle={setIsExpanded}
        onSelect={onSelect}
        selections={filterBy}
        isExpanded={isExpanded}
        ariaLabelledBy="title-id"
        isDisabled={false}
      >
        {options.map((o) => <SelectOption key={o} value={o} />)}
      </Select>
      <InputGroup>
        <TextInput
          type="search"
          aria-label={t('accounts_table.data_toolbar.search_widget.text_input_aria_label')}
          placeholder={t('accounts_table.data_toolbar.search_widget.placeholder', { option: filterBy.toLowerCase() })}
          value={term}
          onChange={setTerm}
        />
        <Button
          variant={ButtonVariant.control}
          aria-label={t('accounts_table.data_toolbar.search_widget.button_aria_label')}
          onClick={() => onFilter(term, filterBy)}
        >
          <SearchIcon />
        </Button>
      </InputGroup>
    </InputGroup>
  )
}

export { Search as DeveloperAccountsSearchWidget }
