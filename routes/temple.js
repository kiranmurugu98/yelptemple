//env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}





//defing the index file with render
let express = require('express');
let router = express.Router();
let { campSchema } = require('../joi')
let wrapAsync = require('../helpers/trycatch');
let CustomError = require('../helpers/customerror')
let { logIn, isAuth, validatecamp } = require('../loginmiddleware')
let temple = require('../controllers/temple')
let multer = require('multer')
let { storage } = require('../cloudinary')
let upload = multer({ storage })




//grouping the same way
router.route('/')
    .get(wrapAsync(temple.index))
    .post(logIn, upload.array('image'), validatecamp, wrapAsync(temple.createnewtemple))


router.get('/new', logIn, temple.newformtemple)

router.route('/:id')
    .get(wrapAsync(temple.showtemple))
    .put(logIn, isAuth, upload.array('image'), validatecamp, wrapAsync(temple.updatetemple))
    .delete(logIn, isAuth, wrapAsync(temple.deletetemple))


//index file
//router.get('/', wrapAsync(camp.index))
//creating a new data with post method
//validating by jio using Middleware
//router.post('/', logIn, validatecamp, wrapAsync(camp.createnewcamp))
//finding the data using the id
//router.get('/:id', wrapAsync(camp.showcamp))
//editing the data using put method
router.get('/:id/edit', logIn, isAuth, wrapAsync(temple.editform))

//router.put('/:id', logIn, validatecamp, isAuth, wrapAsync(camp.updatecamp))
//delete the file using method override method
//router.delete('/:id', logIn, isAuth, wrapAsync(camp.deletecamp))


module.exports = router;