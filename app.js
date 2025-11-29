const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const app =express();

// connectin to dbms
mongoose.connect("mongodb://127.0.0.1:27017/userdb").then(()=>{
    console.log("server is connected");
}).catch((err)=>{
    console.log("err");
});
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});
 const user = new mongoose.model("user", userSchema);
  
 app.use(express.static("public"));
 app.set("view engine" ,"ejs");
 app.use(bodyParser.urlencoded({extended:"true"}));
 const saltCount = 10;
 
 // get method
 app.get("/",function(req,res){
    res.render("home");
 });
 app.get("/signup",function(req,res){
    res.render("signup");
 });
 app.get("/login",function(req,res){
    res.render("login");
 });
 app.get("/access",function(req,res){
    res.render("access");
 });

 // post request
 app.post("/signup",function(req,res){
    bcrypt.hash(req.body.password , saltCount , function(err , hash){
        const newUser = new user({
            email:req.body.username,
            password:hash
        });
        newUser.save(res.render("login"));
       });
    });
 //});
 //post request for login
 app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password; 

    user.findOne({email:username}).then(function( foundUser){
        
            if(foundUser){
                bcrypt.compare(req.body.password,password).then(function(result){
                    if(result==true){
                        res.render("access")
                    }
                }).catch(function(err){
                    console.log(err);
                });
            }
        }).catch(function(err){
            console.log(err);
        })
    });
 //starting u server
 app.listen(3000,function(){
    console.log("server started");
 });