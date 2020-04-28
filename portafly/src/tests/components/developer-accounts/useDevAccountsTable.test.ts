import { useDevAccountsTable } from 'components/developer-accounts'
import { developerAccounts } from 'tests/examples'

it('should work', () => {
  const isMultitenant = false
  expect(useDevAccountsTable(developerAccounts, isMultitenant)).not.toBeUndefined()
})
