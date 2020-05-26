const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const hbs = require('express-handlebars');
const session = require('express-session');
const route = require('./routes/index');
const flash = require('express-flash');
const app = express();
app.use(session({
    secret: 'uni#rel@off',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(body_parser.text());
app.use(express.static(__dirname + '/public'));
app.engine('hbs', hbs({
    defaultLayout: 'layout',
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', route);
<<<<<<< HEAD
const port = process.env.PORT;
const server = app.listen(port, function () {
=======
const server = app.listen(80, function () {
>>>>>>> 811a7d418efd146584cea55810b42fec6f8f0566
    console.log("Relcon Tag Scanner Running");
});
