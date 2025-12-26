const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Contact API');
});

module.exports = router;
