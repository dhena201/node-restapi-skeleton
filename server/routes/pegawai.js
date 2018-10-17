const router = require('express').Router();
const PegawaiCtrl = require('./../controllers/pegawai');

router.get('/', PegawaiCtrl.getAll);

module.exports = router;