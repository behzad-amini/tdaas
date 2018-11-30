var express                 = require('express'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    User                    = require('./models/user'),
    Item                    = require('./models/item'),    
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose');
    
mongoose.connect('mongodb://localhost/job_mngt_app');

var app=express();

app.use(require('express-session')({
    secret: 'smile buddy',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//====================
//   Routs
//====================

app.get('/',function(req,res){
    res.render('home');
});

app.get('/jobmanager',isLoggedIn,function(req,res){
    res.render('jobmanager');
});

//=======================
// Authentication Routs
//=======================


//registeration
//=============
app.get('/register', function(req, res) {
    res.render('register');    
} );
app.post('/register',function(req,res){
    
    if(req.body.password!=req.body.passwordr){
        res.render('register');
    }
    
    User.register(new User({username: req.body.username}),
                    req.body.password,
                    function(err,user){
                        if(err){
                            console.log(err);
                            res.render('register');
                        }
                    
                        passport.authenticate("local")(req, res, function(){
                            res.send('registeration worked');
                        });
                    }
    )
});

//login
//=============
app.get('/login',function(req, res) {
    res.render('login');
});

app.post('/login',passport.authenticate("local",{
    successRedirect: '/jobmanager',
    failureRedirect: '/login'
}),function(req,res){
})

//logout
//=============
app.get('/logout',function(req, res) {
    req.logout();
    res.redirect('/');
});

//is logged in middleware
//=============
function isLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }    
    
    res.render('login');
}


//=======================
// Item CRUD test
//=======================
var desk = new Item({
    name: 'deskBahal2', 
    photoAddress:'https://images.neimanmarcus.com/ca/1/products/az/NM-4ACZ_az.jpg'
})

// Item Save (Create)
//-----------------------
desk.save(function(err,deskKhubu){
   if(err){
       console.log(err);
   } else{
       console.log('desk saved successfully');
       console.log(deskKhubu);
   }
});

// new + save:
//--------------
Item.create({
   name: 'beautiful item',
   phone: 12345 // this will not be saved because it is not in the schema
}, function(err, item1){
    if(err){
        console.log(err);
    }else{
        console.log('saved item br create command');
        console.log(item1);
    }
});


// Item find (Read)
//-----------------------

// All --> leave the object in find empty i.e. {}
Item.find({},function(err,items){
    if(err){
        console.log(err);
    }else{
        console.log('found items are:');
        console.log(items);
    }
});

// one --> pass the property to the find i.e. {name='something'}
Item.find({name:'deskBahal'},function(err,items){
    if(err){
        console.log(err);
    }else{
        console.log('foun items from name are:');
        console.log(items);
    }
});
// ---- also item.findById(id,funct...) --- works with the id

// Item Update (U)
//-----------------------

// Item.findByIdAndUpdate(id, newData, callback)
// e.g. Item.findByIdAndUpdate(req.body.id, req.body.Item, function(err,item){..})




// Item Delete (D)
//-----------------------

// Item.findByIdAndRemove(id,  callback)
// e.g. Item.findByIdAndRemove(req.body.id, function(err){..})

//====================
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('Server Started!');
})

