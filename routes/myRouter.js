const express = require('express')
const router = express.Router()
const path = require('path')

const Product = require('../models/products')

const multer = require('multer') //ใช้ multer จัดการกับการส่งไฟล์ ไปยังโฟลเดอร์ของweb app

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/products')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'.jpg') //ตั้งชื่อไฟล์ตามเวลาที่อัพโหลดป้องกันชื่อซ้ำ
    }
})

const upload = multer({
    storage:storage
})

router.get('/',(req,res)=>{
    Product.find().exec((err,data)=>{
        res.render('index',{data:data})
    })
})

router.get('/manage',(req,res)=>{
    if(req.session.login){
        Product.find().exec((err,data)=>{
            res.render('manage',{data:data})
        })
    }
    else{
        res.render('login',{currentURL:'manage'})
    }
})

router.get('/form',(req,res)=>{
    if(req.session.login){
        res.render('form')
    }
    else{
        res.render('login',{currentURL:'form'})
    }
})

router.get('/product/:id',(req,res)=>{
    Product.findOne({_id:req.params.id}).exec((err,data)=>{
        res.render('product',{data:data})
    })
})

router.get('/del/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id,{useFindAndModify:false}).exec(err=>{
        if(err){console.log(err)}
        res.redirect('/manage')
    })
})

router.get('/edit/:id',(req,res)=>{
    Product.findOne({_id:req.params.id}).exec((err,data)=>{
        res.render('edit',{data:data})
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

router.post('/insert',upload.single('src'),function(req,res){
    //อ้างอิงpostจากform method อ้างอิงinsertจากform action
    let doc = new Product({
        name:req.body.name,
        price:req.body.price,
        src:req.file.filename,
        des:req.body.des
    })
    Product.saveProduct(doc,(err)=>{
        if(err) console.log(err)
        res.redirect('/')
    })
})

router.post('/update/:id',(req,res)=>{
    let newData = {
        name:req.body.name,
        price:req.body.price,
        des:req.body.des
    }
    Product.updateOne({_id:req.params.id},{$set:newData}).exec(err=>{
        if(err){console.log(err)}
        res.redirect('/manage')
    })
})

router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const timeExp = 60*(10**3)
    const currentURL = req.body.currentURL
    if(username==='admin'&&password==='password'){
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExp
        res.redirect(`/${currentURL}`)
    }
    else{
        res.render('404')
    }
})
module.exports = router
