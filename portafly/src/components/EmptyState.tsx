import React from 'react'
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Bullseye,
  EmptyStateBody
} from '@patternfly/react-core'
import { CubesIcon, SearchIcon } from '@patternfly/react-icons'
import { IRow } from '@patternfly/react-table'

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

type ICreateTableEmptyState = (title: string, body: string, button?: JSX.Element) => IRow[]

const CreateTableEmptyState: ICreateTableEmptyState = (title, body, button) => [{
  heightAuto: true,
  cells: [{
    props: { colSpan: 8 },
    title: (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h2" size="lg">
            {title}
          </Title>
          <EmptyStateBody>
            {body}
          </EmptyStateBody>
          {button}
        </EmptyState>
      </Bullseye>
    )
  }]
}]

export { SimpleEmptyState, CreateTableEmptyState }
