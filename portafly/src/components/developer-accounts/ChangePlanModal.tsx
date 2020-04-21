import React from 'react'
import {
  Modal,
  Button,
  Form,
  Text,
  TextContent,
  TextList,
  TextListItem
} from '@patternfly/react-core'
import { useTranslation } from 'react-i18next'

interface IChangePlanModal {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  admins: string[]
}

const ChangePlanModal: React.FunctionComponent<IChangePlanModal> = ({
  isOpen,
  onClose,
  onSubmit,
  admins
}) => {
  const { t } = useTranslation('accounts')

  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={onSubmit}
    >
      {t('modals.change_plan.send')}
    </Button>,
    <Button key="cancel" variant="link" onClick={onClose}>
      {t('modals.change_plan.cancel')}
    </Button>
  ]

  return (
    <Modal
      width="44%"
      title={t('modals.change_plan.title')}
      isOpen={isOpen}
      onClose={onClose}
      actions={actions}
      isFooterLeftAligned
    >
      <TextContent>
        <Text>{t('modals.change_plan.to')}</Text>
        <TextList>
          {admins.map((a) => <TextListItem key={a}>{a}</TextListItem>)}
        </TextList>
      </TextContent>
      <Form>
        {/* TODO */}
      </Form>
    </Modal>
  )
}

export { ChangePlanModal }
