var express                 = require('express'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    User                    = require('./models/user'),
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

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//====================
//   Routs
//====================

app.get('/',function(req,res){
    res.render('home');
});

app.get('/jm',function(req,res){
    res.render('jobmanager');
});

//=======================
// Authentication Routs
//=======================
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







//====================
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('Server Started!');
})

