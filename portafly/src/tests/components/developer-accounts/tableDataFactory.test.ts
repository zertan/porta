import { generateColumns, generateRows } from 'components/developer-accounts'
import { developerAccounts } from 'tests/examples'

it('should work', () => {
  const isMultitenant = false
  expect(generateColumns(developerAccounts, jest.fn())).not.toBeUndefined()
  expect(generateRows(developerAccounts, isMultitenant)).not.toBeUndefined()
})
