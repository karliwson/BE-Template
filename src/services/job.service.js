const { Op } = require('sequelize')
const {
  sequelize, Profile, Contract, Job,
} = require('../models')

/**
 * Get all unpaid jobs for a user (for active contracts only).
 * @param {{profile: Object}} input
 * @returns {Object[]}
 */
const findUnpaid = async ({ profile }) => {
  const unpaidJobs = await Job.findAll({
    where: {
      paid: { [Op.not]: true },
    },
    include: {
      model: Contract,
      where: {
        [Op.or]: {
          ClientId: profile.id,
          ContractorId: profile.id,
        },
        status: 'in_progress',
      },
      attributes: [],
      required: true,
    },
  })

  return unpaidJobs
}

/**
 * Pay for a job.
 * @param {{profile: Object, jobId: number}} input
 */
const pay = async ({ profile, jobId }) => {
  const job = await Job.findOne({
    where: { id: jobId },
    attributes: ['id', 'price', 'paid'],
    include: [{
      model: Contract,
      where: { ClientId: profile.id },
      attributes: ['id', 'status'],
      required: true,
      include: [{
        model: Profile,
        as: 'Client',
        attributes: ['id', 'balance'],
        required: true,
      }, {
        model: Profile,
        as: 'Contractor',
        attributes: ['id', 'balance'],
        required: true,
      }],
    }],
  })

  if (!job) {
    throw new Error('The specified job doesn\'t exist or doesn\'t belong to you')
  }

  if (job.paid === true) {
    throw new Error('The specified job has already been paid')
  }

  if (job.price > profile.balance) {
    throw new Error('You don\'t have sufficient funds')
  }

  let transaction
  try {
    transaction = await sequelize.transaction()

    const {
      Client: client,
      Contractor: contractor,
    } = job.Contract

    // Move funds
    client.balance -= job.price
    contractor.balance += job.price

    // Mark the job as paid
    job.paid = true
    job.paymentDate = new Date()

    // Save and commit
    await Promise.all([
      client.save({ transaction }),
      contractor.save({ transaction }),
      job.save({ transaction }),
    ])
    await transaction.commit()
  } catch (err) {
    transaction && transaction.rollback()

    const message = process.env.NODE_ENV === 'development'
      ? err.message
      : 'error'
    throw new Error(`Database error: ${message}`)
  }
}

module.exports = {
  findUnpaid,
  pay,
}
