const mongoose = require('mongoose')
const express = require('express')
const app = express();
const methodOverride = require('method-override')
const flash = require("express-flash");
const session = require("express-session");
const User = require('./model/User')





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



//get home page

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'kyle' })
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





app.listen(3000, () => console.log(`Server started on Port ${PORT}`))