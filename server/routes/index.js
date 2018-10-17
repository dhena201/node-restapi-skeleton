const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Welcome to FOG API');
});

module.exports = router;