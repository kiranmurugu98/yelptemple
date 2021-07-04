let User = require('../models/userSchema')

module.exports.newuserform = function (req, res) {
    res.render('auth/register')
}

module.exports.newregister = async function (req, res) {
    try {
        let { username, email, password } = req.body;
        let userdef = new User({ username, email })
        let validUser = await User.register(userdef, password);
        console.log(validUser)
        req.login(validUser, err => { //using passport plugin
            if (err) return next(err);
            req.flash('success', 'Welcome To YelpTemple :)')
            res.redirect('/index')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginform = function (req, res) {
    res.render('auth/login')
}

module.exports.logincredits = function (req, res) {
    //res.send(req.body)
    req.flash('success', 'Welcome Back Again!!!');
    let redirect = req.session.return || '/index'
    res.redirect(redirect)
}

module.exports.logout = function (req, res) {
    req.logOut(); //with passport plugin
    req.flash('success', 'Logout success,See You Later!!')
    res.redirect('/index')
}