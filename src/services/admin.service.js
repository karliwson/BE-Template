const { Op } = require('sequelize')
const {
  sequelize, Profile, Contract, Job,
} = require('../models')

/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range.
 * @param {{startDate: string, endDate: string}} input
 * @returns {{profession: string, amount: number}}
 */
const getBestProfession = async ({ startDate, endDate }) => {
  const [result = null] = await Profile.findAll({
    where: { type: 'contractor' },
    attributes: [
      'profession',
      [sequelize.fn('SUM', sequelize.col('Contractor->Jobs.price')), 'amount'],
    ],
    include: [{
      model: Contract,
      as: 'Contractor',
      attributes: [],
      include: [{
        model: Job,
        where: {
          paid: true,
          createdAt: { [Op.between]: [startDate, endDate] },
        },
        attributes: [],
      }],
    }],
    group: ['profession'],
    order: [[sequelize.literal('amount DESC LIMIT 1')]],
    having: { amount: { [Op.not]: null } },
    /**
     * Sequelize is placing the limit clause at the wrong place inside the query,
     * so I've used a literal in the order clause as a quick fix.
     */
    // limit: 1,
  })

  return result
}

/**
 * Returns the clients the paid the most for jobs in the query time period.
 * @param {{startDate: string, endDate: string, limit: number}} input
 * @returns {{id: number, fullName: string, paid: boolean}[]}
 */
const getBestClients = async ({ startDate, endDate, limit = 2 }) => {
  const result = await Profile.findAll({
    where: { type: 'client' },
    attributes: [
      'id',
      [sequelize.literal('firstName || \' \' || lastName'), 'fullName'],
      [sequelize.fn('SUM', sequelize.col('Client->Jobs.price')), 'paid'],
    ],
    include: [{
      model: Contract,
      as: 'Client',
      attributes: [],
      include: [{
        model: Job,
        where: {
          paid: true,
          paymentDate: { [Op.between]: [startDate, endDate] },
        },
        attributes: [],
      }],
    }],
    group: ['Profile.id'],
    order: [[sequelize.literal(`paid DESC LIMIT ${limit}`)]],
    having: { paid: { [Op.not]: null } },
    /**
     * Sequelize is placing the limit clause at the wrong place inside the query,
     * so I've used a literal in the order clause as a quick fix.
     */
    // limit: limit,
  })

  return result
}

module.exports = {
  getBestProfession,
  getBestClients,
}
