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
import { DataToolbarFilter, DataToolbarGroup, DataToolbarChip } from '@patternfly/react-core/dist/js/experimental'

type Filter = string
type Category = string
type CategoryOptions = Record<string, string>
type CategoryData = {
  humanName: string
  options?: CategoryOptions
}

interface ICategorySelect {
  categories: Record<Category, CategoryData>
  selections: string
  onCategorySelect: (c: Category) => void
}

const CategorySelect = ({ categories, selections, onCategorySelect }: ICategorySelect) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const onSelect = (_: any, value: string | SelectOptionObject) => {
    onCategorySelect(value as Category)
    setIsExpanded(false)
  }
  return (
    <Select
      toggleIcon={<FilterIcon />}
      variant={SelectVariant.single}
      aria-label="Filter-by select"
      onSelect={onSelect}
      selections={selections}
      isExpanded={isExpanded}
      onToggle={setIsExpanded}
      ariaLabelledBy="title-id"
      isDisabled={false}
    >
      { Object.keys(categories)
        .map((cat) => <SelectOption key={cat} value={categories[cat].humanName} />) }
    </Select>
  )
}

interface ICollectionSelect {
  onCollectionSelect: (checked: boolean, selection: string) => void
  collection: CategoryOptions
  selections: string[]
  category: string
}

const CollectionSelect = ({
  onCollectionSelect, collection, selections, category
}: ICollectionSelect) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const onSelect = (ev: React.SyntheticEvent, selection: string | SelectOptionObject) => {
    const { checked } = ev.currentTarget as HTMLInputElement
    onCollectionSelect(!!checked, selection as string)
  }
  return (
    <Select
      variant={SelectVariant.checkbox}
      onSelect={onSelect}
      selections={selections}
      isExpanded={isExpanded}
      onToggle={setIsExpanded}
      placeholderText={`Filter by ${category}`}
    >
      { Object.keys(collection).map((key) => (
        <SelectOption key={key} value={collection[key]} />
      )) }
    </Select>
  )
}

interface ISearchBar {
  textInputRef: React.RefObject<HTMLInputElement>
  category: Category
  onSearchClick: (value: string) => void
}

const SearchBar = ({ textInputRef, category, onSearchClick }: ISearchBar) => {
  const onClick = () => {
    if (textInputRef.current?.value) {
      onSearchClick(textInputRef.current.value)
      textInputRef.current.value = ''
    }
  }
  return (
    <InputGroup>
      <TextInput
        ref={textInputRef}
        type="search"
        aria-label="Aria label of the text input for filtering"
        placeholder={`Filter by ${category}`}
        onKeyUp={(ev) => ev.key === 'Enter' && onClick()}
      />
      <Button
        variant={ButtonVariant.control}
        aria-label="Aria label for button"
        onClick={onClick}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  )
}

const categoryHasCollection = (categoryData: CategoryData) => !!categoryData.options

interface ISearchWidget {
  categories: Record<Category, CategoryData>
  filters?: Record<Category, Filter[]>,
  onFiltersChange: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

const SearchWidget: React.FunctionComponent<ISearchWidget> = ({
  categories,
  filters,
  onFiltersChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0])
  const textInputRef = useRef<HTMLInputElement>(null)

  const onCategorySelect = (category: Category) => {
    setSelectedCategory(category)
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

  const onCollectionSelect = (category: Category) => (checked: boolean, option: string) => (
    (checked) ? addChip(category, option) : removeSelection(category, option)
  )

  const onSearchClick = (value: string) => addChip(selectedCategory, value)

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


  return (
    <DataToolbarGroup variant="filter-group">
      <CategorySelect
        onCategorySelect={onCategorySelect}
        selections={selectedCategory}
        categories={categories}
      />
      { dataToolbarFilters }
      { categoryHasCollection(categories[selectedCategory])
        ? (
          <CollectionSelect
            collection={categories[selectedCategory].options as CategoryOptions}
            selections={['asd']}
            category={selectedCategory}
            onCollectionSelect={onCollectionSelect(selectedCategory)}
          />
        )
        : (
          <SearchBar
            textInputRef={textInputRef}
            category={selectedCategory}
            onSearchClick={onSearchClick}
          />
        )}
    </DataToolbarGroup>
  )
}

export { SearchWidget }
