var express = require("express");


var app=express();
app.set('view-engines','ejs');

app.get("/",function(req,res){
    res.render("home");
})