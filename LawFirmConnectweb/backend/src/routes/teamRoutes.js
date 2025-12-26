const express = require('express');
const router = express.Router();
// const { ... } = require('../controllers/teamController'); // Stub for now

router.get('/', (req, res) => {
    res.send('Team API');
});

module.exports = router;
