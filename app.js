require('dotenv').config()

const express = require('express')
const session = require('express-session')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use(session({
    secret:process.env.SESSION_SECRET,

    resave:false,

    saveUninitialized:false,

    cookie:{
        secure:false,
        maxAge:86400000
    }
}))

app.use(express.static(
    path.join(__dirname,'public')
))

app.use('/', require('./routes/web'))

app.listen(process.env.PORT, ()=>{

    console.log(
        `Running on ${process.env.PORT}`
    )

})