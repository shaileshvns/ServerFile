const nodemailer = require('nodemailer')

// for uplaoding  image and document
const multer = require('multer')

const fs = require('fs')//file system module

const express = require('express')

const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { info } = require('console')

app.use(bodyParser,urlencoded({extended:true}))
app.use(bodyParser.json())
const app = express()
var to;// email address
var subject;// what is subject line
var body;// what is actual content.
var path;// save the directory for uploading file

var storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./images')
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }

})

var upload = multer({
    storage:Storage
}).single('image');// that middleware ready to upload

//request handler from public folder 
app.use(express.static('public'))


app.get('/',(req,res) => {
    res.sendFile('/index.html')
})


 app.post('/sendemail',(req,res) => {
     upload(req,res,function(err){
         if(err){
             console.log(err)
             return res.end("Something went wrong")
         }
         else{
             to = req.body.to
             subject = req.body.subject
             body = req.body.body
             path = req.file.path

             console.log(to)
             console.log(subject)
             console.log(body)
             console.log(path)

             var transporter = nodemailer.createTransport({
                 service:'gmail',
                 auth:{
                     user:'codexbombom@gmail.com',
                     pass:'tested123456!@#'
                 }
             })

             var mailOptions = {
                 from:'codexbombom@gmail.com',
                 to:to,
                 subject:subject,
                 test:body,
                 attachments:[{path:path}]

             }
             transporter.sendMail(mailOptions,fucntion(err,info){
                 if (err) {
                     console.log(err)
                 }
                 else
                 {
                     console.log("Email Sent" +info.response)
                 }
             })
         }
     })
     

 })
app.listen(5000,() => {
    console.log("App satrted on Port 5000")
})