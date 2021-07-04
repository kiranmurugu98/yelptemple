//env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


//require the needee
let express = require('express');
let app = express();
let path = require('path');
let ejsMate = require('ejs-mate');
//helmet
let helmet = require("helmet");
//session
let session = require('express-session');
//flash
let flash = require('connect-flash');
//passport require
let passport = require('passport');
let localpassport = require('passport-local');

//mongoose santize
let mongoSanitize = require('express-mongo-sanitize');


//require the methodoverride
let methodoverride = require('method-override')
//usermodel
let User = require('./models/userSchema');
//defining the view engine and its directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//importing the campground route
let temple = require('./routes/temple');
//importing the review route
let review = require('./routes/review');
//importing the user route
let authuser = require('./routes/users')

//session mongo
let MongoDBStore = require('connect-mongo')(session);

app.engine('ejs', ejsMate);
//using the urlencoded
app.use(express.urlencoded());
app.use(methodoverride('_method'));



//static file
app.use(express.static(path.join(__dirname, 'publicaccess')));


// connecting with mongodb with default port
const mongoose = require('mongoose');
const { Console } = require('console');
//using the default port
let db = process.env.DB
/* let db = 'mongodb://localhost:27017/yelptemple' */


mongoose.connect(db,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(functions => {
        console.log('Mongo Connected Successfully!!!')
    }).catch(err => {
        console.log('Mongo Error :(')
        console.log(err)
    })


let secret = process.env.SECRET || 'kiran';

//session with mongo
let store = new MongoDBStore({
    url: db,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})



//sesion
let sesConfig = {
    store,
    name: '_session',
    secret,
    resave: false,
    saveuninitilize: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//use of helmet
app.use(helmet({
    contentSecurityPolicy: false,
}

));

// To remove data, use:
app.use(mongoSanitize());
//using session
app.use(session(sesConfig));
//flash
app.use(flash());
//passport use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localpassport(User.authenticate()));//static method

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//middleware for flash
app.use(function (req, res, next) {
    //console.log(req.session)
    res.locals.signedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//route use 
app.use('/index', temple)
app.use('/index/:id/reviews', review)
app.use('/', authuser)


//index file
app.get('/', function (req, res) {
    res.render('index');
})
//map
app.get('/maps', function (req, res) {
    res.render('map');
})


//just working with passport
app.get('/newuser', async function (req, res) {
    let adduser = new User({ email: 'sample1@gmail.com', username: 'ezhil' })
    let validateUser = await User.register(adduser, 'dogs@123')
    //console.log(validateUser);
    res.send(validateUser)

})




//default err
app.use(function (err, req, res, next) {
    const { status = 500 } = err;
    if (!err.message) err.message = "OPPS! Something Went Wrong :("
    res.status(status).render('error', { err })
})



//app listern in 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

//defaut
app.get('*', function (req, res) {
    res.render('index');
})