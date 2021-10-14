const validator = require('validator')
const { StatusCodes } = require('http-status-codes')
const { JobService } = require('../services')

const findUnpaid = async (req, res) => {
  const { profile } = req

  try {
    const data = await JobService.findUnpaid({ profile })
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

const pay = async (req, res) => {
  const { profile, params: { job_id: jobId } } = req

  if (!validator.isInt(jobId)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Invalid parameters',
    })
  }

  if (profile.type !== 'client') {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: 'fail',
      message: 'Only clients can pay for jobs',
    })
  }

  try {
    await JobService.pay({ profile, jobId })
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'The job has been successfully paid',
    })
  } catch (err) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: err.message,
    })
  }
}

module.exports = {
  findUnpaid,
  pay,
}
