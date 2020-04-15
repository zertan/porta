import React from 'react'
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Bullseye,
  EmptyStateBody,
  Button
} from '@patternfly/react-core'
import { CubesIcon, SearchIcon } from '@patternfly/react-icons'

export interface ISimpleEmptyStateProps {
  msg: string
}

const SimpleEmptyState: React.FunctionComponent<ISimpleEmptyStateProps> = ({ msg }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h5" size="lg">
      {msg}
    </Title>
  </EmptyState>
)

const emptyTableRows = [{
  heightAuto: true,
  cells: [{
    props: { colSpan: 8 },
    title: (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h2" size="lg">
            No results found
          </Title>
          <EmptyStateBody>
            No results match the filter criteria. Remove all
            filters or clear all filters to show results.
          </EmptyStateBody>
          <Button variant="link">Clear all filters</Button>
        </EmptyState>
      </Bullseye>
    )
  }]
}]

export { SimpleEmptyState, emptyTableRows }
