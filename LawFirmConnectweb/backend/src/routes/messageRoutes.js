const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Message API');
});

module.exports = router;
