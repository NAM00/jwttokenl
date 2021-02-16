const express = require('express');
 const mongoose = require('mongoose');
 const postRoute = require('./routes/posts');
// const bodyParser = require('body-parser');
const app =express();
require('dotenv/config');


//import routes

const authRoute = require('./routes/auth');

//Middlewares

app.use(express.json());

//route Middlewares

app.use('/api/user', authRoute);
app.use('/api/post', postRoute);

////DataBase connection

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true,useUnifiedTopology: true } )
    .then((result) => {console.log('Connected to DB');
        app.listen(3000);})
    .catch((err) => console.log(err));


