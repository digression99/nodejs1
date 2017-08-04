/**
 * Created by kimilsik on 7/11/17.
 */

module.exports = function() {
    var router = require('express').Router();

    router.get('/', function(req, res) {
        res.render('shoppingcart/main1');
    });

    return router;
};

