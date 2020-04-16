import React, { useState } from 'react'
import {
  Modal,
  Button,
  Form,
  FormGroup,
  Text,
  TextInput,
  TextContent,
  TextList,
  TextListItem
} from '@patternfly/react-core'
import { useTranslation } from 'react-i18next'

interface ISendEmailModal {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  admins: string[]
}

const SendEmailModal: React.FunctionComponent<ISendEmailModal> = ({
  isOpen, onClose, onSend, admins
}) => {
  const { t } = useTranslation('accounts')

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const isSendDisabled = subject.length === 0 || message.length === 0

  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={onSend}
      isDisabled={isSendDisabled}
    >
      {t('modals.send_email.send')}
    </Button>,
    <Button key="cancel" variant="link" onClick={onClose}>
      {t('modals.send_email.cancel')}
    </Button>
  ]

  return (
    <Modal
      width="44%"
      title={t('modals.send_email.title')}
      isOpen={isOpen}
      onClose={onClose}
      actions={actions}
      isFooterLeftAligned
    >
      <TextContent>
        <Text>{t('modals.send_email.to')}</Text>
        <TextList>
          {admins.map((a) => <TextListItem key={a}>{a}</TextListItem>)}
        </TextList>
      </TextContent>
      <Form>
        <FormGroup
          label={t('modals.send_email.subject')}
          isRequired
          fieldId="send-email-subject"
          // helperText="Please provide your full name"
        >
          <TextInput
            isRequired
            type="text"
            // id="simple-form-name"
            // name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            value={subject}
            onChange={setSubject}
          />
        </FormGroup>
        <FormGroup
          label={t('modals.send_email.message')}
          isRequired
          fieldId="send-email-message"
          // helperText="Please provide your full name"
        >
          <TextInput
            isRequired
            type="text"
            // id="simple-form-name"
            // name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            value={message}
            onChange={setMessage}
          />
        </FormGroup>
      </Form>
    </Modal>
  )
}

export { SendEmailModal }
