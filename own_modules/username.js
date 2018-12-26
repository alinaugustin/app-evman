exports.username(userId){
    var usernameQuery = "SELECT * FROM `users` WHERE id = '" + userId + "'";
    db.query(usernameQuery, function(err, result){
       if (err) {
          //return res.status(500).send(err);
          console.log("deletefile:",err);
       }
       return username = result[0].user_name;
 });   
}