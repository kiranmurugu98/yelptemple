//require the neede
let express = require('express');
let router = express.Router();
let User = require('../models/userSchema')
let wrapAsync = require('../helpers/trycatch');
let passport = require('passport');
let user = require('../controllers/users')
var async = require("async");
let nodemailer = require("nodemailer");
let crypto = require("crypto");


//grouping modles
router.route('/register')

    .get(user.newuserform)
    .post(wrapAsync(user.newregister))

router.route('/login')
    .get(user.loginform)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), user.logincredits)

// forgot password function
router.get('/forgot', function (req, res) {
    res.render('auth/forget');
});

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tamilmusic1998@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'noreply@yelptemple.com',
                subject: 'YelpTemple Reset Password Mail',
                text: 'YelpTemple - Password Reset For ' + user.email + ' Please Follow The Instruction.\n\n' +
                    'Please click on the following Link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    "WARNING - If You not requested This Process, Don't Worry Password will remain same Till you didn't complete this process and this link will be deactivate with in 1 Hour\n"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});
//reset 
router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('auth/reset', { token: req.params.token });
    });
});


router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tamilmusic1998@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'noreply@yelptemple.com',
                subject: 'YelpTemple password has been changed Succesfully',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the YelpTemple password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/index');
    });
});

//register a new user
//router.get('/register', user.newuserform)

//router.post('/register', wrapAsync(user.newregister))

//login 
//router.get('/login', user.loginform)
//default from passport
//router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), user.logincredits)
//logout 
router.get('/logout', user.logout)

module.exports = router;