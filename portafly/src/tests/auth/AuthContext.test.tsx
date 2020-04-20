import { AuthProvider, useAuth } from 'auth'
import * as React from 'react'
import { render, fireEvent, getNodeText } from '@testing-library/react'

const SamplePage = () => {
  const { authToken, setAuthToken } = useAuth()
  return (
    <>
      <input data-testid="login" onChange={(ev) => setAuthToken(ev.currentTarget.value)} />
      { authToken ? <p>Authenticated</p> : <p>Log in?</p> }
    </>
  )
}

const SampleApp = () => <AuthProvider><SamplePage /></AuthProvider>

test('should change the document title', () => {
  const { container, getByTestId } = render(<SampleApp />)
  const login = getByTestId('login')

  expect(getNodeText(container.querySelector('p'))).toBe('Log in?')

  fireEvent.change(login, { target: { value: 'LeToken' } })
  expect(getNodeText(container.querySelector('p'))).toBe('Authenticated')
})
