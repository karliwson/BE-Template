const validator = require('validator')
const { StatusCodes } = require('http-status-codes')
const { AdminService } = require('../services')

const getBestProfession = async (req, res) => {
  const { query: { start: startDate, end: endDate } } = req

  if (!(validator.isDate(startDate) && validator.isDate(endDate))) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Invalid parameters',
    })
  }

  try {
    const data = await AdminService.getBestProfession({ startDate, endDate })
    res.status(StatusCodes.OK).json({
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

const getBestClients = async (req, res) => {
  const { query: { start: startDate, end: endDate, limit = 2 } } = req

  if (!(validator.isDate(startDate) && validator.isDate(endDate) && validator.isInt(limit))) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Invalid parameters',
    })
  }

  try {
    const data = await AdminService.getBestClients({ startDate, endDate, limit })
    res.status(StatusCodes.OK).json({
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
  getBestProfession,
  getBestClients,
}
