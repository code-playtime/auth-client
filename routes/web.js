const router = require('express').Router()

const auth = require('../middleware/auth')

router.get('/',(req,res) => {
    res.sendFile(
        require('path')
        .join(
            __dirname,
            '../views/home.html'
        )
    )
})

router.get('/login',(req,res)=>{
    const redirectUrl=
        `${process.env.AUTH_URL}/app-auth`+
        `?client_id=${process.env.CLIENT_ID}`+
        `&redirect_uri=http://localhost:3000/auth-webhook`

    res.redirect(
        redirectUrl
    )
})

router.get('/register',(req,res)=>{
    const redirectUrl=
        `${process.env.AUTH_URL}/app-auth`+
        `?client_id=${process.env.CLIENT_ID}`+
        `&redirect_uri=http://localhost:3000/auth-webhook`+
        `&dest=register`

    res.redirect(
        redirectUrl
    )
})

router.get("/auth-webhook", (req, res) => {
    res.send(`<h1>Welcome to home</h1>`);
})

router.get('/dashboard',auth,(req,res) => {
    res.send(`
        <h1>Dashboard</h1>

        <p>
            Welcome ${req.session.user.name}
        </p>

        <a href="/logout">
        Logout
        </a>
    `)
})


router.get('/logout',(req,res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router