const user = require('express').Router();
const controller = require('../user/UserController');
const request = require('../user/UserRequest');
user.get('/welcome', async (req, res) => {
    res.render('login', { message: req.flash('error'), login: true });
});
user.post('/signin', async (req, res) => {
    await request.LoginRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('/');
        } else {
            await controller.VerifyUser(req).then(function (results) {
                if (!results) {
                    res.redirect('/');
                } else {
                    res.redirect('home');
                }
            });
        }
    });
});


user.post('/create-user', async (req, res) => {
    await request.CreateUserRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('create');
        } else {
            await controller.CreateUser(req).then(function (results) {
                res.redirect('create');
            });
        }
    });
});
user.get('/create', async (req, res) => {
    await controller.GetRole(req).then(function (results) {
        if (!results) {
            res.render('createuser', { message: req.flash('error') });
        } else {
            res.render('createuser', { role: results, message: req.flash('error') });
        }
    });
});




user.post('/create-role', async (req, res) => {
    await request.UserRoleRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('role');
        } else {
            await controller.CreateRole(req).then(function (results) {
                res.redirect('role');
            });
        }
    });
});
user.get('/role', async (req, res) => {
    res.render('createrole', { message: req.flash('error') });
});



user.get('/home', async (req, res) => {
    res.render('home');
});
user.get('/logout', async (req, res) => {
    await controller.UserLogout(req).then(function (results) {
        if (!results) {
            res.redirect('back');
        } else {
            res.redirect('/');
        }
    });
});
module.exports = user;