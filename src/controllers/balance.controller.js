const validator = require('validator')
const { StatusCodes } = require('http-status-codes')
const { BalanceService } = require('../services')

const deposit = async (req, res) => {
  const {
    profile,
    params: { userId },
    body: { amount },
  } = req

  if (!(validator.isInt(userId) && validator.isDecimal(String(amount)))) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Invalid parameters',
    })
  }

  try {
    const success = await BalanceService.deposit({ profile, userId, amount })

    if (!success) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: 'fail',
        message: 'Could not complete the deposit',
      })
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Deposit completed successfully',
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'An error has occurred while processing the request',
    })
  }
}

module.exports = {
  deposit,
}
