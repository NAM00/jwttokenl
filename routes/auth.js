const router =require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');



router.post('/register', async (req,res) => {

    //validate
    // res.send(error.details[0].message);
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //checking if the user is already in db
    const emailExist= await  User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user =new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.json({user: user._id});
    }catch (err) {
        res.json(err);
    }
});


router.post('/login', async (req,res) => {
    //login
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in db
    const user = await  User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exists');

    //Password is correct
const  validPass = await  bcrypt.compare(req.body.password, user.password);

if(!validPass) return  res.status(400).send('Invalid Password');
 //create and assign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
 res.send('logged in');

});

module.exports=router;