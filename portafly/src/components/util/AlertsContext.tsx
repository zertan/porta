import React, { useContext } from 'react'
import {
  AlertGroup,
  AlertActionCloseButton,
  Alert,
  AlertVariant
} from '@patternfly/react-core'

interface IAlert {
  key: string
  variant: keyof typeof AlertVariant
  title: string
  timeout: NodeJS.Timeout
}

type IAlertsContext = { addAlert: (alert: Omit<IAlert, 'timeout'>) => void }
const AlertsContext = React.createContext<IAlertsContext>({ addAlert: () => {} })

const AlertsProvider: React.FunctionComponent = ({ children }) => {
  const [alerts, setAlerts] = React.useState<IAlert[]>([])

  const removeAlert = (key: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((a) => a.key !== key))
  }

  const addAlert = (alert: Omit<IAlert, 'timeout'>) => {
    const timeout = setTimeout(() => removeAlert(alert.key), 8000)
    setAlerts((prevAlerts) => [...prevAlerts, { ...alert, timeout }])
  }

  const CloseButton = ({ key, timeout }: Pick<IAlert, 'key' | 'timeout'>) => (
    <AlertActionCloseButton
      title="button title"
      variantLabel="variant alert"
      onClose={() => {
        removeAlert(key)
        clearTimeout(timeout)
      }}
    />
  )

  return (
    <AlertsContext.Provider value={{ addAlert }}>
      <AlertGroup isToast>
        {alerts.map(({
          key, variant, title, timeout
        }) => (
          <Alert
            key={key}
            isLiveRegion
            variant={variant}
            title={title}
            action={<CloseButton key={key} timeout={timeout} />}
          />
        ))}
      </AlertGroup>
      {children}
    </AlertsContext.Provider>
  )
}

const useAlertsContext = () => useContext(AlertsContext)

export { AlertsProvider, useAlertsContext }
