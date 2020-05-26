const route = require('express').Router();
const web = require('./web');
const mobile = require('./mobile');

route.get('/', async (req, res) => {
    res.render('login', { message: req.flash('error'), login: true });
});

route.use('/web', web);
route.use('/api', mobile);
module.exports = route;
