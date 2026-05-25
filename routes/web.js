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
        `${process.env.AUTH_URL}/login`+
        `?client_id=test123`+
        `&redirect_uri=http://localhost:3000/callback`

    res.redirect(
        redirectUrl
    )
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