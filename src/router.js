const router = require('express').Router()
const {
  ContractController,
  JobController,
  BalanceController,
  AdminController,
} = require('./controllers')

router.get('/contracts', ContractController.findAll)
router.get('/contracts/:id', ContractController.findOne)

router.get('/jobs/unpaid', JobController.findUnpaid)
router.post('/jobs/:job_id/pay', JobController.pay)

router.post('/balances/deposit/:userId', BalanceController.deposit)

router.get('/admin/best-profession', AdminController.getBestProfession)
router.get('/admin/best-clients', AdminController.getBestClients)

module.exports = router
