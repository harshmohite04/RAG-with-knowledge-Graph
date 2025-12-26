const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Portal API');
});

module.exports = router;
