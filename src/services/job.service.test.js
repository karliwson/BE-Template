jest.mock('../models/config')

const JobService = require('./job.service')

describe('JobService: findUnpaid()', () => {
  beforeEach(async () => {
    await require('../../scripts/seedDb').seed()
  })

  test('find unpaid jobs on active contracts for the current user', async () => {
    const profile = { id: 1 }
    const result = await JobService.findUnpaid({ profile })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      id: 2,
      description: 'work',
      price: 201,
    })
  })

  test('return an empty array when there are no unpaid jobs on active contracts', async () => {
    const { Contract } = require('../models/contract.model')

    await Contract.update({ status: 'terminated' }, { where: { id: 2 } })
    const profile = { id: 1 }
    const result = await JobService.findUnpaid({ profile })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })
})

describe('JobService: pay()', () => {
  beforeEach(async () => {
    await require('../../scripts/seedDb').seed()
  })

  test('pays for a job that belongs to the current user', async () => {
    const { Profile } = require('../models/profile.model')
    const profile = await Profile.findOne({ where: { id: 1 }, raw: true })
    const jobId = 2

    const result = await JobService.pay({ profile, jobId })
      .then(() => true)
      .catch(() => false)

    expect(result).toBe(true)
  })

  test('throws an error if the job doesn\'t exist', async () => {
    const profile = { id: 1 }
    const jobId = 0

    const result = await JobService.pay({ profile, jobId })
      .then(() => true)
      .catch(() => false)

    expect(result).toBe(false)
  })

  test('throws an error if the job doesn\'t belong to the current user', async () => {
    const profile = { id: 2 }
    const jobId = 1

    const result = await JobService.pay({ profile, jobId })
      .then(() => true)
      .catch(() => false)

    expect(result).toBe(false)
  })

  test('throws an error if the job has already been paid', async () => {
    const { Job } = require('../models')
    const profile = { id: 1, balance: Number.MAX_SAFE_INTEGER }
    const jobId = 2

    await Job.update(
      {
        paid: true,
        paymentDate: new Date(),
      }, {
        where: {
          id: jobId,
        },
      },
    )

    const result = await JobService.pay({ profile, jobId })
      .then(() => true)
      .catch(() => false)

    expect(result).toBe(false)
  })

  test('throws an error if the client doesn\'t have sufficient funds', async () => {
    const profile = { id: 1, balance: 0 }
    const jobId = 2

    const result = await JobService.pay({ profile, jobId })
      .then(() => true)
      .catch(() => false)

    expect(result).toBe(false)
  })
})
