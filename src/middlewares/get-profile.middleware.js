const { StatusCodes } = require('http-status-codes')
const { Profile } = require('../models')

const getProfile = async (req, res, next) => {
  const profile = await Profile.findOne({
    where: { id: req.get('profile_id') || 0 },
    raw: true,
  })

  if (!profile) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Unauthorized',
    })
  }

  req.profile = profile

  next()
}

module.exports = { getProfile }
