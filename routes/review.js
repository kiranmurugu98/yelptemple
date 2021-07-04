let express = require('express');
let router = express.Router({ mergeParams: true });

//middleware file
let { logIn, validatereview, isReviewAuth } = require('../loginmiddleware')
//require the review File
let Review = require('../models/reviewtemple');

//campground file
const Campground = require('../models/temple');

//require the trycatch file
let wrapAsync = require('../helpers/trycatch');
//requring the customError File
let CustomError = require('../helpers/customerror')
//controller 
let review = require('../controllers/review')



//creating a review for camp ground
router.post('/', logIn, validatereview, wrapAsync(review.createNewReview))

//deleteting the review by method override
router.delete('/:aboutId', logIn, isReviewAuth, wrapAsync(review.deleteReview))


module.exports = router;