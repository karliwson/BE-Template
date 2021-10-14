jest.mock('../models/config')

const ContractService = require('./contract.service')

describe('ContractService: findAll()', () => {
  beforeEach(async () => {
    await require('../../scripts/seedDb').seed()
  })

  test('returns the non-terminated contracts for the current user', async () => {
    const profile = { id: 1 }
    const result = await ContractService.findAll({ profile })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      id: 2,
      status: 'in_progress',
    })
  })

  test('returns an empty array if no non-terminated contracts exist for the current user', async () => {
    const { Contract } = require('../models/contract.model')

    await Contract.update({ status: 'terminated' }, { where: { id: 2 } })
    const profile = { id: 1 }
    const result = await ContractService.findAll({ profile })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })
})

describe('ContractService: findOne()', () => {
  beforeEach(async () => {
    await require('../../scripts/seedDb').seed()
  })

  test('returns a specific contract that belongs to the current user', async () => {
    const profile = { id: 1 }
    const contractId = 1
    const result = await ContractService.findOne({ profile, contractId })

    expect(result).toMatchObject({
      id: 1,
      status: 'terminated',
    })
  })

  test('doesn\'t return contracts that don\'t belong to the current user', async () => {
    const profile = { id: 2 }
    const contractId = 1
    const result = await ContractService.findOne({ profile, contractId })

    expect(result).toBe(null)
  })
})
