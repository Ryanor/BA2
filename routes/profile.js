var express = require('express');
var path = require('path');
var router = express.Router();

/* GET profiles */
router.get('/json1', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '../public/profiles', 'test_profile.json'));
});


module.exports = router;
