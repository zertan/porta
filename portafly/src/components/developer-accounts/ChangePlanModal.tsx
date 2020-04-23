import React, { useState, useMemo } from 'react'
import {
  Modal,
  Button,
  Form,
  Text,
  TextContent,
  TextList,
  TextListItem,
  FormSelect,
  FormSelectOption,
  FormGroup
} from '@patternfly/react-core'
import { useTranslation } from 'react-i18next'
import { useAlertsContext } from 'components/util'
import { changePlan } from 'dal/accounts/bulkActions'

interface IProps {
  onClose: () => void
  admins: string[]
}

const ChangePlanModal: React.FunctionComponent<IProps> = ({
  onClose,
  admins
}) => {
  const { t } = useTranslation('accounts')
  const { addAlert } = useAlertsContext()

  const [value, setValue] = useState('')
  const [isListCollapsed, setIsListCollapsed] = useState(admins.length > 5)

  const onSubmit = () => {
    onClose()
    const start = t('toasts.change_plan_start')
    const success = t('toasts.change_plan_success')
    const error = t('toasts.change_plan_error')
    addAlert({ key: Date.now().toString(), variant: 'info', title: start })
    changePlan()
      .then(() => addAlert({ key: Date.now().toString(), variant: 'success', title: success }))
      .catch(() => addAlert({ key: Date.now().toString(), variant: 'danger', title: error }))
  }

  const actions = [
    <Button
      key="confirm"
      variant="primary"
      onClick={onSubmit}
      isDisabled={value === ''}
    >
      {t('modals.change_plan.send')}
    </Button>,
    <Button key="cancel" variant="link" onClick={onClose}>
      {t('modals.change_plan.cancel')}
    </Button>
  ]

  const options = [
    { value: '', label: '' },
    { value: 'plan_a', label: 'Plan A' },
    { value: 'plan_b', label: 'Plan B' },
    { value: 'plan_c', label: 'Plan C' }
  ]

  const textListItems = useMemo(
    () => admins.map((a) => <TextListItem key={a}>{a}</TextListItem>),
    [admins]
  )

  const adminList = isListCollapsed ? (
    <>
      {textListItems.slice(0, 5)}
      <Button component="a" onClick={() => setIsListCollapsed(false)} variant="link">
        {t('modals.expand_list_button', { count: admins.length - 5 })}
      </Button>
    </>
  ) : textListItems

  return (
    <Modal
      width="44%"
      title={t('modals.change_plan.title')}
      isOpen
      onClose={onClose}
      actions={actions}
      isFooterLeftAligned
    >
      <TextContent>
        <Text>{t('modals.change_plan.to')}</Text>
        <TextList>
          {adminList}
        </TextList>
      </TextContent>
      <Form>
        <FormGroup
          label={t('modals.change_plan.select_label')}
          type="string"
          fieldId="state"
        >
          <FormSelect
            id="state"
            value={value}
            onChange={setValue}
            aria-label={t('aria-label-select')}
          >
            {options.map((option) => (
              <FormSelectOption key={option.value} value={option.value} label={option.label} />
            ))}
          </FormSelect>
        </FormGroup>
      </Form>
    </Modal>
  )
}

export { ChangePlanModal }
