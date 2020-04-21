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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AlertsContext = React.createContext({ addAlert: (alert: IAlert) => {} })

const AlertsProvider: React.FunctionComponent = ({ children }) => {
  const [alerts, setAlerts] = React.useState<IAlert[]>([])

  const removeAlert = (key: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((a) => a.key !== key))
  }

  const addAlert = (alert: IAlert) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert])
    setTimeout(() => removeAlert(alert.key), 3000)
  }

  return (
    <AlertsContext.Provider value={{ addAlert }}>
      <AlertGroup isToast>
        {alerts.map(({ key, variant, title }) => (
          <Alert
            key={key}
            isLiveRegion
            variant={variant}
            title={title}
            action={(
              <AlertActionCloseButton
                title="button title"
                variantLabel="variant alert"
                onClose={() => removeAlert(key)}
              />
            )}
          />
        ))}
      </AlertGroup>
      {children}
    </AlertsContext.Provider>
  )
}

const useAlertsContext = () => useContext(AlertsContext)

export { AlertsProvider, useAlertsContext }
