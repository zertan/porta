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

interface IChangeStatusModal {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  admins: string[]
}

const ChangeStatusModal: React.FunctionComponent<IChangeStatusModal> = ({
  isOpen, onClose, onSend, admins
}) => {
  const { t } = useTranslation('accounts')

  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={onSend}
    >
      {t('modals.change_status.send')}
    </Button>,
    <Button key="cancel" variant="link" onClick={onClose}>
      {t('modals.change_status.cancel')}
    </Button>
  ]

  return (
    <Modal
      width="44%"
      title={t('modals.change_status.title')}
      isOpen={isOpen}
      onClose={onClose}
      actions={actions}
      isFooterLeftAligned
    >
      <TextContent>
        <Text>{t('modals.change_status.to')}</Text>
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

export { ChangeStatusModal }
