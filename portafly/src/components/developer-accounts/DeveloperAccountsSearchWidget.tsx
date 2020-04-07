import React, { useState } from 'react'
import {
  SelectOption,
  Select,
  SelectVariant,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant
} from '@patternfly/react-core'
import { FilterIcon, SearchIcon } from '@patternfly/react-icons'

type ISearch = {
  options: Array<string>
  // options: Array<{ value: string, disabled?: boolean, isPlaceholder?: boolean}>
}

const Search: React.FunctionComponent<ISearch> = ({ options }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const onSelect = () => {
    // TODO
    setIsExpanded(!isExpanded)
  }

  const items = [
    { value: 'Choose...', disabled: false, isPlaceholder: true },
    ...options.map((o) => ({ value: o, disabled: false, isPlaceholder: false }))
  ]

  return (
    <InputGroup>
      <Select
        toggleIcon={<FilterIcon />}
        variant={SelectVariant.single}
        aria-label="Select Input"
        onToggle={setIsExpanded}
        onSelect={onSelect}
        // selections={selected}
        isExpanded={isExpanded}
        ariaLabelledBy="title-id"
        isDisabled={false}
      >
        {items.map((i) => (
          <SelectOption
            isDisabled={i.disabled}
            key={i.value}
            value={i.value}
            isPlaceholder={i.isPlaceholder}
          />
        ))}
      </Select>
      <InputGroup>
        <TextInput
          name="textInput1"
          id="textInput1"
          type="search"
          aria-label="search input example"
        />
        <Button variant={ButtonVariant.control} aria-label="search button for search input">
          <SearchIcon />
        </Button>
      </InputGroup>
    </InputGroup>
  )
}

export { Search as DeveloperAccountsSearchWidget }
