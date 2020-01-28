const mongoose = require('mongoose')
const express = require('express')
const app = express();
const methodOverride = require('method-override')
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyToken = require('./verifyToken')
const generateToken = require('./generateToken')
const JWT = require('jsonwebtoken')


const dotenv = require('dotenv')
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash());
app.use(
    session({
        secret: "anything",
        resave: false,
        saveUninitialized: false
    })
);
app.use(bodyParser())

app.use(express.json());
app.use(cors());
app.use(cookieParser());



//get home page

app.get('/', (req, res, ) => {

    User.findOne({ email: 'eshankasun@yahoo.com' }, 'name email', (err, docs) => {

        res.render('index.ejs', {
            user: docs
        })

    })


})
// get cookie data
app.get('/users', (req, res) => {
    const token = req.cookies.access_token

    const decoded = JWT.verify(token, TOKEN_SECRET)
    res.status(200).json(users)
})
//get login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
//get register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

//post
app.post('/register', (req, res) => {

})
app.post('/login', (req, res) => {

})


// import Routes
const authRoute = require('./auth')
const postRoute = require('./routes/post')
// dot env init
dotenv.config()

//connect to DB
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true }, () => console.log('Connected to DB!'))

var User = require('./model/User');

//Middleware
app.use(express.json());

app.get('/', function (req, res) {
    req.flash('info', 'Welcome');
    res.render('index', {
        title: 'Home'
    })
});
app.get('/addFlash', function (req, res) {
    req.flash('info', 'Flash Message Added');
    res.redirect('/');
});


//route Middlewares
app.use('/api/user', authRoute)

app.use('/api/post', postRoute)



// // console.log(User.find())
// User.findOne().exec(function (err, docs) {
//     console.log(docs.name)
//     userId = docs.name
//     console.log(userId)
// });



app.listen(3000, () => console.log(`Server started on Port ${PORT}`))