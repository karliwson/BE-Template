const { Op } = require('sequelize')
const { Profile, Contract, Job } = require('../models')

/**
 * Deposits money into the the the balance of a client.
 *
 * The requirements don't state that a client can only make deposits to himself,
 * so, as there's a userId param in the URL, we're considering that deposits
 * can be made to any client.
 *
 * @param {{profile: Object, userId: number, amount: number}} input
 * @returns {boolean}
 */
const deposit = async ({ profile, userId, amount }) => {
  if (profile.type !== 'client') {
    throw new Error('Only clients can make deposits')
  }

  // Calculate the maximum allowed amount (total debt of current user's unpaid jobs + 25%)
  const unpaidAmount = await Job.sum('price', {
    where: { paid: { [Op.not]: true } },
    include: [{
      model: Contract,
      where: { ClientId: profile.id },
      attributes: [],
      required: true,
    }],
  })
  const maxAmount = unpaidAmount + unpaidAmount * 0.25

  if (amount > maxAmount) {
    throw new Error('The deposit amount can\'t be over 25% of the current debt')
  }

  const [[, success = false]] = await Profile.increment('balance', {
    by: amount,
    where: {
      id: userId,
      type: 'client',
    },
  })

  return !!success
}

module.exports = {
  deposit,
}
