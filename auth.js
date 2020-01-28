const router = require('express').Router()
const User = require('./model/User')
const { registerValidation, loginValidation } = require('./validation')
const verifyToken = require('./verifyToken')
const generateToken = require('./generateToken')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const dotenv = require('dotenv')




//VALIDATION
const Joi = require('@hapi/joi')

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
})




router.post('/register', async (req, res) => {

    //Lets validate the data before we make a user

    // filtered error
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //full error 
    // const validation = schema.validate(req.body);
    // res.send(validation);

    ///checking if usere exist
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('email already exists')



    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })


    try {
        const savedUser = await user.save();
        res.redirect('/login')

    } catch (err) {
        res.staus(400).send(err)
    }
})

//Log in

router.post('/login', async (req, res, ) => {
    // lets validate data
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    ///checking if email exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('email is not found')
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('invalid password')


    //create and asighn a token

    const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    console.log(generateToken)
    generateToken(res, user._id, user.email, user.name)
    res.header('auth-token', token)








    //redirect to home page
    res.redirect('/')

})

// get cookie data
router.get('/', (req, res) => {

    verifyToken(res, user._id, user.email, user.name)
    res.status(200).json()
})

//log out

router.delete('/logout', async (req, res, _id) => {

    const token = jwt.sign({ _id: null }, process.env.TOKEN_SECRET)


    res.header('auth-token', token)


    res.redirect('/login')

})

module.exports = router