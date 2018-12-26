//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   //var session = req.session; 
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var bcryptF = require('bcrypt');
      var hash = "SELECT password FROM `users` WHERE `user_name`='"+name+"' ";
      db.query(hash, function(err, results){
         if(results.length){
            var hashed = results[0].password;
            //console.log("hash=",hashed);
            var verifyPass = bcryptF.compareSync(pass, hashed);
            //console.log("verifyPass=",verifyPass);
            var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' ";
            if(verifyPass){
            db.query(sql, function(err, results) {
               if (err) throw err;
               //console.log(results);   
               req.session.userId = results[0].id;
               req.session.user = results[0];
               //req.session.userRol = results[0].rol; console.log('userRol=',req.session.userRol);
               //console.log(results[0].id);
               res.redirect('/dashboard');
                  });
               }  
            else{
               message = 'Credentiale gresite! Ati introdus utilizatorul/parola gresit.';
               res.render('index.ejs',{message: message});
            }
         }
         else{
            message = 'Eroare de conectare.';
            res.render('index.ejs',{message: message});
         }
      });
   } else {
      res.render('index.ejs',{message: message});
   }         
};
//--------checkadmin
exports.checkadmin = function() {
   var userId = req.session.userId; 
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            return 0;
            //return res.status(500).send(err);
         }  
         var rezult_rol = result[0].rol;
         console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin') {
            res.redirect("/login");
            return 0;
        }
      });
      return 1;
   }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){        
   var user =  req.session.user,
   userId = req.session.userId;
   //console.log('dashboard.userId=',userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//----------------------------------show users all --------------------------------------
exports.utilizatori_admin = function(req, res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            return;
            //return res.status(500).send(err);
         }  
         var rezult_rol = result[0].rol;
         console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin')
            {res.redirect("/login");
            return;
          }
      });
   }
   var sql="SELECT * FROM `users` ";          
   db.query(sql, function(err, result){  
      var utilizatori = result;
      //console.log('utilizatori:',utilizatori);
      res.render('utilizatori_admin.ejs',{utilizatori:result});
      
   });
};
//---------------------------------delete users----------------------------------
exports.deleteUser=function(req,res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            //return;
            //return res.status(500).send(err);
         }  
         var rezult_rol = result[0].rol;
         console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin') {
            res.redirect("/login");
            return;
        }
      });
   }
   console.log('userId=',userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var userIddel = req.params.id;
   console.log('deleteprofile:: userIddel=',userIddel);
   var deleteUserQuery = 'DELETE FROM users WHERE id = "' + userIddel + '"';
   db.query(deleteUserQuery, function(err, result){
   if (err) {
      message = 'S-a ivit o eroare. Profilul nu a fost sters';
      res.render('utilizatori_admin.ejs',{message: message});
      }
   res.redirect('/utilizatori-admin');
   });
};
//---------------------------------new add users ----------------------------------
exports.utilizatori_add=function(req,res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (result[0].rol != 'admin') {
            res.redirect("/login");
            return;
            //return res.status(500).send(err);
         }  else {
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username= post.user_name;
      var pass= post.password;
      var firstname= post.first_name;
      var lastname= post.last_name;
      var mobno= post.mob_no;
      var e_mail = post.email;
      var rrol= post.rol;
      var bcrypt = require("bcrypt");
      var passcrypt = bcrypt.hashSync(pass, 10);
      var sqlimport ="SELECT * FROM `users` WHERE `user_name`='"+username+"' ";
      if(post && username && pass && firstname && lastname && mobno && e_mail && pass && rrol) {
      db.query(sqlimport, function(err, results) {
         console.log("results",results);
      if(results.length) {
         message = 'Utilizatorul exista. Va rugam sa va conectati!';
         res.render('index.ejs',{message: message});
      } else {
         var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`,`email`,`password`,`rol`) VALUES ('" + firstname + "','" + lastname + "','" + mobno + "','" + username + "','" + e_mail + "','" + passcrypt + "','" + rrol + "')";
         var query = db.query(sql, function(err, result) {
         message = "Succes! Contul a fost creat.";
         res.render('utilizatori_add',{message: message});
      });
      }
   });
   }
   else {
      message = 'Trebuie sa completati toate casutele!';
      res.render('utilizatori_add.ejs',{message: message});
   }
   } else {
      res.render('utilizatori_add');
   }
   }
   });
   }
};
//---------------------------------edit users details after login----------------------------------
exports.editPageProfile=function(req,res){
   var userId = req.params.id;
   var query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.render('edituser.ejs', {title: "Edit  User",user: result[0],message: ''});
   });
};
//--userProfile edit user profile users
exports.editUserProfile=function(req,res){
   var userId = req.params.id;
   var first_name = req.body.first_name;
   var last_name = req.body.last_name;
   var mob_no = req.body.mob_no;
   var query = "UPDATE `users` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `mob_no` = '" + mob_no + "' WHERE `users`.`id` = '" + userId + "'";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.redirect('/profile');
   });
};
//-----utilizatori edit Page admin
exports.utilizatori_editPage=function(req,res){
    var userIdutiliz = req.session.userId;
   if(userIdutiliz == null ){
    res.redirect("/login");
    return;
    } else {
    var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userIdutiliz+"' ";
    db.query(sqlnonad, function(err, result){
       if (err) {
          res.redirect("/login");
          //return;
          //return res.status(500).send(err);
       }  
       var rezult_rol = result[0].rol;
       console.log('rezult_rol:',rezult_rol);
       if(rezult_rol != 'admin') {
          res.redirect("/login");
          return;
      }
    });
 }
   var userId = req.params.id;
   var query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.render('utilizatori_edit.ejs', {title: "Edit  User",user: result[0],message:message});
   });
};
//--------utilizatori admin
exports.utilizatori_editUser=function(req,res){
    var userIdutiliz = req.session.userId;
   if(userIdutiliz == null ){
    res.redirect("/login");
    return;
    } else {
    var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userIdutiliz+"' ";
    db.query(sqlnonad, function(err, result){
       if (err) {
          res.redirect("/login");
          //return;
          //return res.status(500).send(err);
       }  
       var rezult_rol = result[0].rol;
       console.log('rezult_rol:',rezult_rol);
       if(rezult_rol != 'admin') {
          res.redirect("/login");
          return;
      }
    });
}
    var userId = req.params.id;
   var first_name = req.body.first_name;
   var last_name = req.body.last_name;
   var mob_no = req.body.mob_no;
   var query = "UPDATE `users` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `mob_no` = '" + mob_no + "' WHERE `users`.`id` = '" + userId + "'";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.redirect('/utilizatori-admin');
   });

};
//----------------------------------show baza man --------------------------------------
exports.baza_man = function(req, res){
   var userId = req.session.userId;
   if(userId == null ){
      res.redirect("/login");
      return;
   } else {
      var sqlnonad="SELECT rol FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sqlnonad, function(err, result){
         if (err) {
            res.redirect("/login");
            //return;
            //return res.status(500).send(err);
         }  
         var rezult_rol = result[0].rol;
         console.log('rezult_rol:',rezult_rol);
         if(rezult_rol != 'admin') {
            res.redirect("/login");
            return;
        }
      });
   }
   var sql1="SELECT * FROM `users` WHERE `id`='"+userId+"' ";
   db.query(sql1, function(err, resultman){
      if (err) {
         return res.status(500).send(err);
      }  
      var rezult_user = resultman[0].user_name;
      console.log('rezult_user:',rezult_user);
      var sql2="SELECT * FROM `baza_man` "; 
      db.query(sql2, function(err, result){ 
         if (err) {
            return res.status(500).send(err);
         }      
      res.render('baza_man.ejs',{manuale:result});
      
      });
   }); 
};
//--baza-man edit Page manual baza admin
exports.baza_maneditPage=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var userNr = req.params.nr;
   console.log('userNr:',userNr);
   var query = "SELECT * FROM `baza_man` WHERE nr = '" + userNr + "' ";
   db.query(query, function(err, result){
       if (err) {
           return res.status(500).send(err);
       }
       res.render('baza_maneditPage.ejs', {
           title: "Edit  Manuale",manuale: result[0],message: ''});
   });
};
//---baza manuale edit admin
exports.baza_maneditManual=function(req,res){
   var userNr = req.params.nr;
   var Titlu_auxiliar = req.body.Titlu_auxiliar;
   var Disciplina = req.body.Disciplina;
   var Clasa = req.body.Clasa;
   var Nivel = req.body.Nivel;
   var Comisia_nr = req.body.Comisia_nr;
   var query = "UPDATE `baza_man` SET `Titlu_auxiliar` = '" + Titlu_auxiliar + "', `Disciplina` = '" + Disciplina + "', `Clasa` = '" + Clasa + "', `Nivel` = '" + Nivel + "', `Comisia_nr` = '" + Comisia_nr + "' WHERE `nr` = '" + userNr + "'";
   db.query(query, function(err, result) {
       if (err) {
           return res.status(500).send(err);
       }
       res.redirect('/baza-manuale');
   });
};
//---------------------------------delete manuale baza_man----------------------------------
exports.deleteManual=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var ManualNr = req.params.nr;
   console.log('userNr=',ManualNr);
   var deleteManualQuery = 'DELETE FROM baza_man WHERE nr = "' + ManualNr + '"';
   db.query(deleteManualQuery, function(err, result){
   if (err) {
      message = 'S-a ivit o eroare. Manualul nu a fost sters';
      res.render('baza-manuale',{message: message});
      }
   res.redirect('/baza-manuale');
   });
};
//-----------select-------------
exports.selectmanual = function(req, res){
   var userId = req.session.userId;
   var message = '';
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql1="SELECT * FROM `users` WHERE `id`='"+userId+"' ";
      db.query(sql1, function(err, resultman){
         if (err) {
            message = "Nu exista niciun utilizator in baza cu acest id!";
            return res.status(500).send(err);
         }
      var usernamesel=resultman[0].user_name;
      usernameconst = usernamesel;  
      //console.log("usernamesel=",usernamesel);
      //console.log("usernamesel:",resultman);
      var sql2="SELECT * FROM `baza_man` WHERE (`ev1`='"+usernamesel+"' || `ev2`='"+usernamesel+"' || `ev3`='"+usernamesel+"' || `ev4`='"+usernamesel+"') "; 
      db.query(sql2, function(err, resultbaza){ 
         if (err) {
            message = "Nu exista niciun manual asociat";
            return res.status(500).send(err);
         }
      //console.log("resultbaza:",resultbaza);
      res.render('select.ejs',{manuale:resultbaza,message:message});
      //res.end();
      });
   });
   
};
//------------page for page selectare
exports.selectare = function(req, res){
   var userId = req.session.userId;
   var message = '';
   if(userId == null){
      res.redirect("/login");
      return;
   }
   if(req.method == "POST"){
      var postselect  = req.body;
      var selectedValue= postselect.selectedManual;
      //message = selectedValue;
      console.log("selectare.selectedValue= " + selectedValue);
      //var selectedValue = req.body.selectedManual;
      if(selectedValue == ''){
         res.redirect('/select');
         return;
      } else {
         console.log("selectedValue:",selectedValue);
         console.log("userId:",userId);
         var sql1="SELECT user_name FROM `users` WHERE `id`='"+userId+"' ";
         db.query(sql1, function(err, resultman){
            if (err) {
               return res.status(500).send(err);
            }
            var rezult_user = resultman[0].user_name;
            console.log('rezult_user:',rezult_user);
            var sql2="SELECT * FROM `bazamanuale` WHERE (`ev1`='"+rezult_user+"' AND `Titlu_auxiliar`='"+selectedValue+"')";
            db.query(sql2, function(err, result){
            //var resultTitlu_auxiliar = result[0].Titlu_auxiliar;
            if(result.length ) 
               {
               console.log("bazamanuale: cautare-Exista elementul selectat!");
               //res.render('selectare.ejs',{manuale2:result});
               res.redirect('/baza-manev');
               }  else {
                console.log("bazamanuale: cautare-NU exista elementul selectat!");
                  var sql3="SELECT * FROM `baza_man` WHERE (`ev1`='"+rezult_user+"' || `ev2`='"+rezult_user+"' || `ev3`='"+rezult_user+"' || `ev4`='"+rezult_user+"')  AND (`Titlu_auxiliar`='"+selectedValue+"')";
                    db.query(sql3, function(err, result3){
                     //if(err) throw err;
                     var rezultselect = result3[0];
                     if(rezultselect) { 
                         console.log('rezultselect.Titlu_auxiliar:',rezultselect.Titlu_auxiliar); 
                     } 
                        //console.log("rezultselect: Nu exista elementul selectat!");   
                    var sql4 = "INSERT INTO `bazamanuale`(`Titlu_auxiliar`,`Nume_si_prenume`,`secretar`,`Disciplina`,`Editura`,`Nivel`,`Clasa`,`Autor`,`Comisia_nr`,`evaluat`,`ev1`) VALUES ('" + rezultselect.Titlu_auxiliar + "','" + rezult_user + "','" + rezultselect.secretar + "','" + rezultselect.Disciplina + "','" + rezultselect.Editura + "','" + rezultselect.Nivel + "','" + rezultselect.Clasa + "','" + rezultselect.Autor + "','" + rezultselect.Comisia_nr + "','nu','" + rezult_user + "')";
                    db.query(sql4, function(err, result4){
                        console.log('rezult_user:',rezult_user);
                        console.log('result4:',result4);
                        if(err) { 
                            console.log('err:',err);
                            //throw err; 
                        } 
                        else {
                        message = "Succes! Contul a fost creat.";
                        }
                    //res.render('selectare.ejs',{manuale2:result4});
                        });              
                        });
                    var sql5="SELECT * FROM `bazamanuale` WHERE (`ev1`='"+rezult_user+"' AND `Titlu_auxiliar`='"+selectedValue+"')";
                    db.query(sql5, function(err, result5){
                    //res.render('selectare.ejs',{manuale2:result5});
                    //res.redirect('back');
                    res.redirect('/baza-manev');
                    });
                    }
            });
        });
        }  
    }
};
//--baza evaluare totala manuale baza_manev bazamanuale
exports.baza_manev = function(req, res){
    var userId = req.session.userId;
    if(userId == null ){
       res.redirect("/login");
       return;
    } 
    var sql1="SELECT * FROM `users` WHERE `id`='"+userId+"' ";
    db.query(sql1, function(err, resultman){
       if (err) {
          return res.status(500).send(err);
       }  
       var rezult_user = resultman[0].user_name;
       //console.log('rezult_user:',rezult_user);
       var sql2="SELECT * FROM `bazamanuale` WHERE (`ev1`='"+rezult_user+"')"; 
       db.query(sql2, function(err, result){ 
          if (err) {
             return res.status(500).send(err);
          }      
       res.render('baza_manev.ejs',{manuale:result});
       
       });
    }); 
 };
 //--baza stergere manual evaluare bazamanuale
 exports.deleteManualEv=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    var ManualNrEv = req.params.nr;
    console.log('ManualNrEv=',ManualNrEv);
    var deleteManualEvQuery = 'DELETE FROM bazamanuale WHERE nr = "' + ManualNrEv + '"';
    db.query(deleteManualEvQuery, function(err, result){
    if (err) {
       message = 'S-a ivit o eroare. Manualul nu a fost sters';
       res.render('bazadeletemanev',{message: message});
       }
    res.redirect('/baza-manev');
    });
 };
 //--baza manuale edit Page manual evaluare baza user
exports.bazamanuale_editPageManualEv=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    var ManualNr = req.params.nr;
    console.log('ManualNr:',ManualNr);
    var query = "SELECT * FROM `bazamanuale` WHERE nr = '" + ManualNr + "' ";
    db.query(query, function(err, result){
        if (err) {
            return res.status(500).send(err);
        }
        res.render('editPageManualEv.ejs', {
            title: "Edit  Manuale Evaluare",manualeEv: result[0],message: ''});
    });
 };
 //---baza manuale edit Manual Ev bazamanuale user
 exports.editManualEv=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    var ManualNr = req.params.nr;
    //1

    var cc1 = req.body.cc1;
    var ncc1 = req.body.ncc1;
    var cc2 = req.body.cc2;
    var ncc2 = req.body.ncc2;
    var cc3 = req.body.cc3;
    var ncc3 = req.body.ncc3;
    var cc4 = req.body.cc4;
    var ncc4 = req.body.ncc4;
    var cc5 = req.body.cc4;
    var ncc5 = req.body.ncc5;
    var cc6 = req.body.cc6;
    var ncc6 = req.body.ncc6;
    var cc7 = req.body.cc7;
    var ncc7 = req.body.ncc7;
    //2
    var cc2_1 = req.body.cc2_1;
    var ncc2_1 = req.body.ncc2_1;
    var cc2_2 = req.body.cc2_2;
    var ncc2_2 = req.body.ncc2_2;
    var cc2_3 = req.body.cc2_3;
    var ncc2_3 = req.body.ncc2_3;
    var cc2_4 = req.body.cc2_4;
    var ncc2_4 = req.body.ncc2_4;
    var cc2_5 = req.body.cc2_5;
    var ncc2_5 = req.body.ncc2_5;
    var cc2_6 = req.body.cc2_6;
    var ncc2_6 = req.body.ncc2_6;
    var cc2_7 = req.body.cc2_7;
    var ncc2_7 = req.body.ncc2_7;
    var cc2_8 = req.body.cc2_8;
    var ncc2_8 = req.body.ncc2_8;
    var cc2_9 = req.body.cc2_9;
    var ncc2_9 = req.body.ncc2_9;
    var cc2_10 = req.body.cc2_10;
    var ncc2_10 = req.body.ncc2_10;
    var cc2_11 = req.body.cc2_11;
    var ncc2_11 = req.body.ncc2_11;
    var cc2_12 = req.body.cc2_12;
    var ncc2_12 = req.body.ncc2_12;
    var cc2_13 = req.body.cc2_13;
    var ncc2_13 = req.body.ncc2_13;
    var cc2_14 = req.body.cc2_14;
    var ncc2_14 = req.body.ncc2_14;
    var cc2_15 = req.body.cc2_15;
    var ncc2_15 = req.body.ncc2_15;
    var cc2_16 = req.body.cc2_16;
    var ncc2_16 = req.body.ncc2_16;
    var cc2_17 = req.body.cc2_17;
    var ncc2_17 = req.body.ncc2_17;
    var cc2_18 = req.body.cc2_18;
    var ncc2_18 = req.body.ncc2_18;
    //3
    var cc3_1 = req.body.cc3_1;
    var ncc3_1 = req.body.ncc3_1;
    var cc3_2 = req.body.cc3_2;
    var ncc3_2 = req.body.ncc3_2;
    var cc3_3 = req.body.cc3_3;
    var ncc3_3 = req.body.ncc3_3;
    var cc3_4 = req.body.cc3_4;
    var ncc3_4 = req.body.ncc3_4;
    var cc3_5 = req.body.cc3_5;
    var ncc3_5 = req.body.ncc3_5;
    //4
    var cc4_1 = req.body.cc4_1;
    var ncc4_1 = req.body.ncc4_1;
    var cc4_2 = req.body.cc4_2;
    var ncc4_2 = req.body.ncc4_2;
    var cc4_3 = req.body.cc4_3;
    var ncc4_3 = req.body.ncc4_3;
    var cc4_4 = req.body.cc4_4;
    var ncc4_4 = req.body.ncc4_4;
    var cc4_5 = req.body.cc4_5;
    var ncc4_5 = req.body.ncc4_5;
    var cc4_6 = req.body.cc4_6;
    var ncc4_6 = req.body.ncc4_6;
    //var Clasa = req.body.Clasa;
    //var Nivel = req.body.Nivel;
    //var Comisia_nr = req.body.Comisia_nr;
    var query = "UPDATE `bazamanuale` SET `cc1` = '" + cc1 + "', `ncc1` = '" + ncc1 + "', `cc2` = '" + cc2 + "', `ncc2` = '" + ncc2 + "', `cc3` = '" + cc3 + "', `ncc3` = '" + ncc3 + "',`cc4` = '" + cc4 + "', `ncc4` = '" + ncc4 + "',`cc5` = '" + cc5 + "', `ncc5` = '" + ncc5 + "', `cc6` = '" + cc6 + "', `ncc6` = '" + ncc6 + "', `cc7` = '" + cc7 + "', `ncc7` = '" + ncc7 + "',`cc2_1` = '" + cc2_1 + "', `ncc2_1` = '" + ncc2_1 + "', `cc2_2` = '" + cc2_2 + "', `ncc2_2` = '" + ncc2_2 + "', `cc2_3` = '" + cc2_3 + "', `ncc2_3` = '" + ncc2_3 + "',`cc2_4` = '" + cc2_4 + "', `ncc2_4` = '" + ncc2_4 + "',`cc2_5` = '" + cc2_5 + "', `ncc2_5` = '" + ncc2_5 + "', `cc2_6` = '" + cc2_6 + "', `ncc2_6` = '" + ncc2_6 + "', `cc2_7` = '" + cc2_7 + "', `ncc2_7` = '" + ncc2_7 + "',`cc2_8` = '" + cc2_8 + "', `ncc2_8` = '" + ncc2_8 + "', `cc2_9` = '" + cc2_9 + "', `ncc2_9` = '" + ncc2_9 + "',`cc2_10` = '" + cc2_10 + "', `ncc2_10` = '" + ncc2_10 + "', `cc2_11` = '" + cc2_11 + "', `ncc2_11` = '" + ncc2_11 + "',`cc2_12` = '" + cc2_12 + "', `ncc2_12` = '" + ncc2_12 + "',`cc2_13` = '" + cc2_13 + "', `ncc2_13` = '" + ncc2_13 + "', `cc2_14` = '" + cc2_14 + "', `ncc2_14` = '" + ncc2_14 + "',`cc2_15` = '" + cc2_15 + "', `ncc2_15` = '" + ncc2_15 + "', `cc2_16` = '" + cc2_16 + "', `ncc2_16` = '" + ncc2_16 + "',`cc2_17` = '" + cc2_17 + "', `ncc2_17` = '" + ncc2_17 + "',`cc2_18` = '" + cc2_18 + "', `ncc2_18` = '" + ncc2_18 + "',`cc3_1` = '" + cc3_1 + "', `ncc3_1` = '" + ncc3_1 + "', `cc3_2` = '" + cc3_2 + "', `ncc3_2` = '" + ncc3_2 + "', `cc3_3` = '" + cc3_3 + "', `ncc3_3` = '" + ncc3_3 + "',   `cc3_4` = '" + cc3_4 + "', `ncc3_4` = '" + ncc3_4 + "',`cc3_5` = '" + cc3_5 + "', `ncc3_5` = '" + ncc3_5 + "',`cc4_1` = '" + cc4_1 + "', `ncc4_1` = '" + ncc4_1 + "', `cc4_2` = '" + cc4_2 + "', `ncc4_2` = '" + ncc4_2 + "', `cc4_3` = '" + cc4_3 + "', `ncc4_3` = '" + ncc4_3 + "',`cc4_4` = '" + cc4_4 + "', `ncc4_4` = '" + ncc4_4 + "',`cc4_5` = '" + cc4_5 + "', `ncc4_5` = '" + ncc4_5 + "',`cc4_6` = '" + cc4_6 + "', `ncc4_6` = '" + ncc4_6 + "' WHERE `nr` = '" + ManualNr + "'";
    db.query(query, function(err, result){
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/baza-manev');
    });
 };
//--pagina incarcare fisier
exports.incarcafisier=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
   var message = '';
   var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
   db.query(usernameQuery, function(err, result){
      if (err) {
         //return res.status(500).send(err);
         console.log("1",err);
      }
      var username = result[0].user_name;   
      var filesample = __dirname + '/public/rapoarte/' + username+'.pdf';
      pathtofile = filesample;   
      console.log("filesample: ",filesample);
      
         
      res.render('incarcafisier.ejs',{username:username,message:message});
   });
//res.render('incarcafisier.ejs',{message:message});
};
//upload files - rapoarte
exports.upload=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var message = 'Nu ati incarcat niciun fisier.';
   if (Object.keys(req.files).length == 0) {
     return res.status(400).send('No files were uploaded.');
   }
   else {
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   var sampleFile = req.files.fileToUpload;
   console.log(sampleFile.name);
   uploadPath = __dirname + '/public/rapoarte/' + sampleFile.name;
   // Use the mv() method to place the file somewhere on your server
   sampleFile.mv(uploadPath, function(err) {
     if (err) {
         console.log("ERR UPLOAD:",err); 
         message = 'Eroare! Fisierul nu a fost incarcat.';
      } else {
         message = '';
      var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
      db.query(usernameQuery, function(err, result){
      if (err) {
         //return res.status(500).send(err);
         console.log("upload:",err);
      }
      var username = result[0].user_name; 
      var filesample = __dirname + '/public/rapoarte/' + username+'.pdf';
      var fs = require('fs');
      // destination.txt will be created or overwritten by default.
      fs.copyFile(uploadPath, filesample, function(err){
      if (err) throw err;
      console.log('File was copied to destination.txt');
      });
      res.render("upload.ejs",{username:result[0].user_name,message:message});
   });    
   }
   });
}
};
//---user download file
exports.downloadfile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var message = '';
   var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
   db.query(usernameQuery, function(err, result){
      if (err) {
         //return res.status(500).send(err);
         console.log("1",err);
      }
      var username = result[0].user_name;
      //var username = req.params.username;  
      var filesample = __dirname + '/public/rapoarte/' + username+'.pdf';
      //var username = req.params.username;
      console.log("username:",username);
      res.download(filesample);
   });
};
// delete uploaded file
//---user download file
exports.deletefile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var message = '';
   var fs = require('fs');
   var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
   db.query(usernameQuery, function(err, result){
      if (err) {
         //return res.status(500).send(err);
         console.log("deletefile:",err);
      }
      var username = result[0].user_name;
      //var username = req.params.username;   
      var filesample = __dirname + '/public/rapoarte/' + username+'.pdf';
      //var username = req.params.username;
      console.log("username:",username);
      fs.unlink(filesample, function(err){
         if (err) throw err;
         console.log('File was deleted.');
         res.redirect('/incarcafisier');
       });
   });
};
//---baza manuale edit Manual Ev cu date bazamanuale user
exports.viewPageManualEv=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   message = '';
   var ManualNrpdf = req.params.nr;
   console.log('ManualNr:',ManualNrpdf);
   //1
   var query = "SELECT * FROM `bazamanuale` WHERE nr = '" + ManualNrpdf + "' ";
   db.query(query, function(err, result){
       if (err) {
           //return res.status(500).send(err);
           throw err;
           //var message="Nu a fost gasit titlul la evaluare!";
       }
       var message = '';
       res.render('editPageManualEvpdf.ejs', {manualeEvpdf: result[0],message:message});
   });
   
   //var Clasa = req.body.Clasa;
   //var Nivel = req.body.Nivel;
   //var Comisia_nr = req.body.Comisia_nr;
   //var query = "UPDATE `bazamanuale` SET `cc1` = '" + cc1 + "', `ncc1` = '" + ncc1 + "', `cc2` = '" + cc2 + "', `ncc2` = '" + ncc2 + "', `cc3` = '" + cc3 + "', `ncc3` = '" + ncc3 + "',`cc4` = '" + cc4 + "', `ncc4` = '" + ncc4 + "',`cc5` = '" + cc5 + "', `ncc5` = '" + ncc5 + "', `cc6` = '" + cc6 + "', `ncc6` = '" + ncc6 + "', `cc7` = '" + cc7 + "', `ncc7` = '" + ncc7 + "',`cc2_1` = '" + cc2_1 + "', `ncc2_1` = '" + ncc2_1 + "', `cc2_2` = '" + cc2_2 + "', `ncc2_2` = '" + ncc2_2 + "', `cc2_3` = '" + cc2_3 + "', `ncc2_3` = '" + ncc2_3 + "',`cc2_4` = '" + cc2_4 + "', `ncc2_4` = '" + ncc2_4 + "',`cc2_5` = '" + cc2_5 + "', `ncc2_5` = '" + ncc2_5 + "', `cc2_6` = '" + cc2_6 + "', `ncc2_6` = '" + ncc2_6 + "', `cc2_7` = '" + cc2_7 + "', `ncc2_7` = '" + ncc2_7 + "',`cc2_8` = '" + cc2_8 + "', `ncc2_8` = '" + ncc2_8 + "', `cc2_9` = '" + cc2_9 + "', `ncc2_9` = '" + ncc2_9 + "',`cc2_10` = '" + cc2_10 + "', `ncc2_10` = '" + ncc2_10 + "', `cc2_11` = '" + cc2_11 + "', `ncc2_11` = '" + ncc2_11 + "',`cc2_12` = '" + cc2_12 + "', `ncc2_12` = '" + ncc2_12 + "',`cc2_13` = '" + cc2_13 + "', `ncc2_13` = '" + ncc2_13 + "', `cc2_14` = '" + cc2_14 + "', `ncc2_14` = '" + ncc2_14 + "',`cc2_15` = '" + cc2_15 + "', `ncc2_15` = '" + ncc2_15 + "', `cc2_16` = '" + cc2_16 + "', `ncc2_16` = '" + ncc2_16 + "',`cc2_17` = '" + cc2_17 + "', `ncc2_17` = '" + ncc2_17 + "',`cc2_18` = '" + cc2_18 + "', `ncc2_18` = '" + ncc2_18 + "',`cc3_1` = '" + cc3_1 + "', `ncc3_1` = '" + ncc3_1 + "', `cc3_2` = '" + cc3_2 + "', `ncc3_2` = '" + ncc3_2 + "', `cc3_3` = '" + cc3_3 + "', `ncc3_3` = '" + ncc3_3 + "',   `cc3_4` = '" + cc3_4 + "', `ncc3_4` = '" + ncc3_4 + "',`cc3_5` = '" + cc3_5 + "', `ncc3_5` = '" + ncc3_5 + "',`cc4_1` = '" + cc4_1 + "', `ncc4_1` = '" + ncc4_1 + "', `cc4_2` = '" + cc4_2 + "', `ncc4_2` = '" + ncc4_2 + "', `cc4_3` = '" + cc4_3 + "', `ncc4_3` = '" + ncc4_3 + "',`cc4_4` = '" + cc4_4 + "', `ncc4_4` = '" + ncc4_4 + "',`cc4_5` = '" + cc4_5 + "', `ncc4_5` = '" + ncc4_5 + "',`cc4_6` = '" + cc4_6 + "', `ncc4_6` = '" + ncc4_6 + "' WHERE `nr` = '" + ManualNr + "'";
   //db.query(query, function(err, result){
   //    if (err) {
   //        return res.status(500).send(err);
   //    }
   //    res.redirect('/baza-manevpdf');
   //});

};
//to PDF
exports.exportToPdf=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }
   //username(userId);
   var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
    db.query(usernameQuery, function(err, result){
      if (err) {
          //return res.status(500).send(err);
          console.log("deletefile:",err);
       }
   var username = result[0];
   var ManualNrpdf = req.params.nr;
   var query = "SELECT * FROM `bazamanuale` WHERE nr = '" + ManualNrpdf + "' ";
   db.query(query, function(err, result){
      if (err) {
         //return res.status(500).send(err);
         throw err;
         //var message="Nu a fost gasit titlul la evaluare!";
      }
      var message = '';
      var ejs2 = require('../own_modules/ejs');
      var pdf2 = require('../own_modules/pdf');
      //var moment = require('moment');
      manualeEvpdf = result[0];
      user = username.user_name;
      //var data = require('./data/data.json');
      ejs2.toHTML('./views/exportToPdf.ejs', manualeEvpdf).then(function (html) {
      var options = { format: 'Letter' };
      var output =  '/public/rapoarte/rap_' + user + '.pdf';
      pdf2.toPDF(html, options, output).then(function (response) {
      console.log("PDF file successfully written");
      console.log(response);
      var filesample = __dirname + './public/rapoarte/rap_' + user +'.pdf';
      //var username = req.params.username;
      console.log("username:",user);
      res.download(output);

      }, function (error) {
        console.error(error);
      }
    );
   }, function (error) {
   console.error(error);
   });
   });
});
};