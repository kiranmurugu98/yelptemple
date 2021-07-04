let CustomError = require('./helpers/customerror')
let Campground = require('./models/temple');
let Review = require('./models/reviewtemple')
let { campSchema, reviewSchema } = require('./joi')



module.exports.logIn = function (req, res, next) {
    req.session.return = req.originalUrl //to retain the original path before login 
    if (!req.isAuthenticated()) {   //authenticate by the passport plugin
        req.flash('error', 'Please Login')
        return res.redirect('/login')

    }
    next()
}
//authorization
module.exports.isAuth = async function (req, res, next) {
    let { id } = req.params;
    let campid = await Campground.findById(id)
    if (!campid.user.equals(req.user._id)) {
        req.flash('error', 'Your Are Not A Author For This Post');
        return res.redirect(`/index/${id}`)
    }
    next();
}

//authorization for thr review
module.exports.isReviewAuth = async function (req, res, next) {
    let { id, aboutId } = req.params;
    let reviewid = await Review.findById(aboutId)
    if (!reviewid.user.equals(req.user._id)) {
        req.flash('error', 'Your Are Not A Author For This Post');
        return res.redirect(`/index/${id}`)
    }
    next();
}

//validating the form with joi for campground
module.exports.validatecamp = function (req, res, next) {

    let { error } = campSchema.validate(req.body)
    if (error) {
        let newerror = error.details.map(err => err.message).join(', ')
        return next(new CustomError(newerror, 400))//throwing a custom error
    } else {
        next()
    }
}


//validating the form with joi for review
module.exports.validatereview = function (req, res, next) {

    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let newerror = error.details.map(err => err.message).join(', ')
        return next(new CustomError(newerror, 400))//throwing a custom error
    } else {
        next()
    }
}
