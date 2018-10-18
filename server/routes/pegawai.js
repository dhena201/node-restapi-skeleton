const 
    router = require('express').Router(),
    Ctrl = require('../controllers');

router.get('/', Ctrl('Kepegawaian/PegawaiController@getAll'));

module.exports = router;