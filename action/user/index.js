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
user.get('/user-view', async (req, res) => {
    await controller.GetUserList(req).then(function (results) {
        if (!results) {
            res.render('viewuser', { message: req.flash('error'), user: [] });
        } else {
            res.render('viewuser', { message: req.flash('error'), user: results });
        }
    });
});
user.get('/user-edit', async (req, res) => {
    let userid = req.query.user;
    await controller.GetUserList(req, userid).then(async function (results) {
        if (!results) {
            res.render('viewuser', { message: req.flash('error'), user: [] });
        } else {
            let user = results;
            await controller.GetRole(req).then(function (results) {
                if (!results) {
                    res.render('viewuser', { message: req.flash('error'), user: [] });
                } else {
                    user[0].Role = results;
                    user[0].message = req.flash('error');
                    roleuser = user[0].Role_User;
                    res.render('updateuser', { message: req.flash('error'), user: user, roleuser: roleuser });
                }
            });
        }
    });
});
user.post('/user-update', async (req, res) => {
    await request.UserUpdateRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('user-edit/?user=' + req.body.User_Id);
        } else {
            await controller.UpdateUser(req).then(function (results) {
                res.redirect('user-edit/?user=' + req.body.User_Id);
            });
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
user.get('/role-view', async (req, res) => {
    await controller.GetRole(req).then(function (results) {
        if (!results) {
            res.render('viewrole', { message: req.flash('error'), role: [] });
        } else {
            res.render('viewrole', { message: req.flash('error'), role: results });
        }
    });
});
user.post('/role-update', async (req, res) => {
    await request.UpdateRoleRequest(req).then(async function (results) {
        if (!results) {
            res.redirect('role-view');
        } else {
            await controller.UpdateRole(req).then(function (results) {
                res.redirect('role-view');
            });
        }
    });
});
user.get('/role-delete', async (req, res) => {
    let roleid = req.query.role;
    await controller.DeleteRole(roleid, req).then(function (results) {
        res.redirect('role-view');
    });
});
user.get('/role-permission', async (req, res) => {
    let roleid = req.query.role;
    await controller.GetRoleById(roleid).then(function (results) {
        if (!results) {
            res.render('rolepermission', { message: req.flash('error'), roleaccess: [], role: roleid });
        } else {
            res.render('rolepermission', { message: req.flash('error'), roleaccess: results, role: roleid });
        }

    });
});

user.post('/role-permission-save', async (req, res) => {
    let roleid = req.body.Role_Id;
    await controller.SaveRoleAccess(req).then(function (results) {
        res.redirect('role-permission/?role=' + roleid);
    });
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