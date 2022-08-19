const express = require('express')
const path = require('path')
const app = express()
const router = require('./routes/myRouter')
const session = require('express-session')


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(session({secret:"mysession",resave:false,saveUninitialized:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))

app.listen(8080,()=>{
    console.log('server start')
})
