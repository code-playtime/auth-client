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

router.get("/auth-webhook", async (req, res) => {
    try {
        const token = req.query.token
        if (!token) {
            return res
                .status(400)
                .send('Token missing')
        }

         const response = await fetch(process.env.AUTH_URL + '/api/auth/exchange', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        token: token,
                                        client_id: process.env.CLIENT_ID,
                                        secret: process.env.CLIENT_SECRET
                                    })
                                })

        if (!response.ok) {
            return res
                .status(401)
                .send('Authentication failed')
        }

        console.log(response.body);

        const data = await response.json()
        const accessToken = data.data.access_token

        if (!accessToken) {
            return res
                .status(401)
                .send('Access token missing')
        }

        const decoded = jwt.decode(accessToken)

        req.session.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        }

        req.session.accessToken = accessToken;

        return res.redirect('/dashboard');
    } catch(error) {
        console.log(error)
        return res
            .status(500)
            .send('Internal server error')
    }
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