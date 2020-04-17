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

type ISearch = {
  onFilter: (term: string, filterBy: string) => void
}

const Search: React.FunctionComponent<ISearch> = ({ onFilter }) => {
  const { t } = useTranslation('accounts')

  const options = [
    t('accounts_table.col_group'),
    t('accounts_table.col_admin'),
    t('accounts_table.col_state')
  ]

  const [isExpanded, setIsExpanded] = useState(false)
  const [filterBy, setFilterBy] = useState(options[0])
  const [term, setTerm] = useState('')
  const textInputRef = useRef<HTMLInputElement>(null)

  const onSelect = (_: any, value: string | SelectOptionObject) => {
    setFilterBy(value as string)
    setIsExpanded(!isExpanded)

    const input = textInputRef.current as HTMLInputElement
    input.focus()
  }

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onFilter(term, filterBy)
    }
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
    </InputGroup>
  )
}

export { Search as DeveloperAccountsSearchWidget }
