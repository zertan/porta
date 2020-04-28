import React from 'react'

import { render } from 'tests/custom-render'
import { SendEmailModal } from 'components/developer-accounts'
import { fireEvent } from '@testing-library/react'

it('should disable its submit button when any field is empty', () => {
  const { baseElement, getByText } = render(<SendEmailModal onClose={jest.fn()} admins={['test']} />)
  const subject = baseElement.querySelector('[name="subject"]')
  const body = baseElement.querySelector('[name="body"]')
  const submitButton = getByText('modals.send_email.send')

  expect(submitButton).toBeDisabled()

  fireEvent.change(subject, { target: { value: 'The subject' } })
  fireEvent.change(body, { target: { value: '' } })
  expect(submitButton).toBeDisabled()

  fireEvent.change(subject, { target: { value: '' } })
  fireEvent.change(body, { target: { value: 'The body' } })
  expect(submitButton).toBeDisabled()

  fireEvent.change(subject, { target: { value: 'The subject' } })
  expect(submitButton).not.toBeDisabled()
})

it('shows up to 5 items and a button to expand the list', () => {
  const admins = new Array(10).fill('test').map((admin, i) => admin + i)
  const { getByText, getAllByText } = render(<SendEmailModal onClose={jest.fn()} admins={admins} />)
  expect(getByText('modals.expand_list_button')).toBeInTheDocument()
  expect(getAllByText(/test/).length).toBe(5)
})
