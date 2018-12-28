/**
* Module dependencies.
*/
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
//var checkadmin = require();
//var http = require('http');
var path = require('path');
//var username = require('/modules/username.js');
//var methodOverride = require('method-override');
var session = require('express-session');
var expressValidator = require('express-validator');
var app = express();
var mysql      = require('mysql');
var fileUpload = require('express-fileupload');
var bodyParser=require("body-parser");
var connection = require('./own_modules/conn');
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(fileUpload()); // configure fileupload
app.use(expressValidator());
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//var pdf = require('pdf');
//var moment = require('moment');
//app.use(username());
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 600000 }
            }));
//security checking admin
// development only
app.get('/', routes.index);//call for main index page
app.post('/', routes.index);//call for main index page
//app.get('/signup', user.signup);//call for signup page
//app.post('/signup', user.signup);//call for signup post 
app.get('/dashboard', user.dashboard);//call for signup page
//app.post('/dashboard', user.dashboard);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/logout', user.logout);//call for logout
//app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/profile',user.profile);//to render users profile
app.get('/profile/edit/:id',user.editPageProfile);//to edit users profile
app.post('/profile/edit/:id',user.editUserProfile);//to edit users profile
app.get('/utilizatori-admin',user.utilizatori_admin);//to render users
app.get('/utilizatori-admin/edit/:id',user.utilizatori_editPage);//to show users Page
app.post('/utilizatori-admin/edit/:id',user.utilizatori_editUser);//to edit users Page
app.get('/utilizatori-admin/delete/:id', user.deleteUser);//delete user
app.get('/utilizatori-add', user.utilizatori_add);//add users new
app.post('/utilizatori-add', user.utilizatori_add);//add users new
// new pages
app.get('/baza-manuale',user.baza_man);//to render man
app.get('/baza-manuale/edit/:nr',user.baza_maneditPage);//to render man
app.post('/baza-manuale/edit/:nr',user.baza_maneditManual);//to render man
app.get('/baza-manuale/delete/:nr', user.deleteManual);//delete user
//default page
app.get('/select',user.selectmanual);//to render default select titlu
app.post('/select',user.selectmanual);//to post result select titlu
//evaluare
app.get('/baza-manev',user.baza_manev);//to render man
app.get('/baza-manev/delete/:nr',user.deleteManualEv);//to render man
app.get('/baza-manev/edit/:nr',user.bazamanuale_editPageManualEv);//to render man
app.post('/baza-manev/edit/:nr',user.editManualEv);//to render man
app.get('/baza-manevpdf/edit/:nr',user.viewPageManualEv);//to render man
app.get('/exportToPdf/:nr',user.exportToPdf);//to render man
//selectare
//app.get('/selectare/',user.selectare);//to render man
app.get('/selectare',user.selectare);//to render man
app.post('/selectare',user.selectare);//to render default
//upload
app.get('/incarcafisier',user.incarcafisier);//to render man
//app.post('/incarcafisier',user.incarcafisier);//to render man
app.get('/upload',user.upload);//to render man
app.post('/upload',user.upload);//to render man
app.get('/rapoarte/:id',user.downloadfile);
app.get('/delete/rapoarte/:id',user.deletefile);
//Middleware
app.listen(1234);
