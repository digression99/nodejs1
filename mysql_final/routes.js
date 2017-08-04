/**
 * Created by kimilsik on 7/7/17.
 */
module.exports = function () {
    var router = require('express').Router();

    router.get('/welcome', function(req, res) {
        if (req.user && req.user.displayName) {
            res.render('others/welcome1', {displayName : req.user.displayName});
        } else {
            res.render('others/welcome2');
        }
    });
    return router;
};
