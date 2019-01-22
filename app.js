/**
* Module dependencies.
*/
var express = require('express');
const helmet = require('helmet')
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
app.use(helmet());
var mysql      = require('mysql');
var csv = require('fast-csv');
var fileUpload = require('express-fileupload');
var bodyParser=require("body-parser");
var connection = require('./own_modules/conn');
var nodeMailer = require('nodemailer');
//app.use(connection);
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
  cookie: { 
    //secure: true,
    httponly: true,
    maxAge: 60 * 60 * 1000 }
}
));
//security checking admin
// development only
app.get('/', routes.index);//call for main index page all
app.post('/', routes.index);//call for main index page all
//app.get('/signup', user.signup);//call for signup page all
//app.post('/signup', user.signup);//call for signup post  all
app.get('/dashboard', user.dashboard);//call for dashboard page user
app.get('/dash-admin', user.dashadmin);//call for dash-admin page admin
app.get('/instructiuni', user.instructiuni);//call for signup page all

app.get('/login', routes.index);//call for login page all
app.post('/login', user.login);//call for login post all
app.get('/logout', user.logout);//call for logout all

app.get('/profile',user.profile);//to render users profile user
app.get('/profile/edit/:id',user.editPageProfile);//to edit users profile user
app.post('/profile/edit/:id',user.editUserProfile);//to edit users profile user
app.get('/utilizatori-admin',user.utilizatori_admin);//to render users admin
//admin pages
app.get('/utilizatori-admin/edit/:id',user.utilizatori_editPage);//to show users Page admin
app.post('/utilizatori-admin/edit/:id',user.utilizatori_editUser);//to edit users Page admin
app.get('/utilizatori-admin/delete/:id', user.deleteUser);//delete user from users admin
app.get('/utilizatori-add', user.utilizatori_add);//add users new for admin Page admin
app.post('/utilizatori-add', user.utilizatori_add);//add users new dor admin post admin
app.get('/baza-admanev',user.baza_admanev);//to render man ev page admin
//admin import csv users
app.get('/baza-admimportusers',user.importcsvusers);//to render man ev page admin
app.get('/uploadadminusers',user.uploadadminusers);//to render raport upload Page admin
app.post('/uploadadminusers',user.uploadadminusers);//to render post file upload raport amin
app.get('/download/csvusers/:id',user.downfileadmuser);//download the file-csv uploaded admin
app.get('/delete/admincsvusers/:id',user.deletefileadmusers);//delete file incarcat admin
//admin import csv baza-man
app.get('/baza-admimportbazaman',user.importcsvbazaman);//to render man ev page admin
app.get('/uploadadminbazaman',user.uploadadminbazaman);//to render raport upload Page admin
app.post('/uploadadminbazaman',user.uploadadminbazaman);//to render post file upload raport amin
app.get('/download/csvbazaman/:id',user.downfileadmbazaman);//download the file-csv uploaded admin
app.get('/delete/admincsvbazaman/:id',user.deletefileadmbazaman);//delete file incarcat admin
//baza fisiere
app.get('/baza-fisusers',user.bazafisusers);//afiseaza rapoarte incarcate admin
app.get('/baza-fisusers/down/:id',user.downloadfileadminall);//download the file-raport uploaded user
// new pages
app.get('/baza-manuale',user.baza_man);//to render man Page baza-man admin
app.get('/baza-manuale/edit/:nr',user.baza_maneditPage);//to render man admin Page admin
app.post('/baza-manuale/edit/:nr',user.baza_maneditManual);//to edit man baza-man admin
app.get('/baza-manuale/delete/:nr', user.deleteManual);//delete man baza-man admin 
//default page
app.get('/select',user.selectmanual);//to render default select titlu user
app.post('/select',user.selectmanual);//to post result select titlu user
//evaluare
app.get('/baza-manev',user.baza_manev);//to render users man ev user 
app.get('/baza-manev/delete/:nr',user.deleteManualEv);//to delete man ev user
app.get('/baza-manev/edit/:nr',user.bazamanuale_editPageManualEv);//to edit Page ev man user
app.post('/baza-manev/edit/:nr',user.editManualEv);//to edit ev man user
app.get('/baza-manevpdf/edit/:nr',user.viewPageManualEv);//to render pdf raport Page user
app.get('/exportToPdf/:nr',user.exportToPdf);//to render pdf raport Page user
//selectare
app.get('/selectare',user.selectare);//to select man Page user 
app.post('/selectare',user.selectare);//to post selected man user 
//upload
app.get('/incarcafisier',user.incarcafisier);//to render man user
//app.post('/incarcafisier',user.incarcafisier);//to render man 
app.get('/upload',user.upload);//to render raport upload Page user
app.post('/upload',user.upload);//to render post file upload raport user
app.get('/rapoarte/:id',user.downloadfile);//download the file-raport uploaded user
app.get('/delete/rapoarte/:id',user.deletefile);//delete raport incarcat user
//send mail
app.get('/sendemailadmin',user.sendemailadmin);//send mail page
app.post('/sendmailadmin',user.sendmailadmin);//send mail page
//descarca baza
app.get('/download/bazacsvusers/',user.bazacsvusers);//download the file-csv uploaded admin
//middleware
app.listen(3000);