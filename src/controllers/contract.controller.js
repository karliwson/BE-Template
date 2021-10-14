const validator = require('validator')
const { StatusCodes } = require('http-status-codes')
const { ContractService } = require('../services')

const findAll = async (req, res) => {
  const { profile } = req

  try {
    const data = await ContractService.findAll({ profile })
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data,
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

const findOne = async (req, res) => {
  const {
    profile,
    params: { id: contractId = null },
  } = req

  if (!validator.isInt(contractId)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Invalid parameters',
    })
  }

  try {
    const data = await ContractService.findOne({ profile, contractId })

    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'fail',
        message: 'The contract doesn\'t exist or does not belong to you',
      })
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data,
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
  findAll,
  findOne,
}
