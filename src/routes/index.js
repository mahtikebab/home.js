/*
 * Default routes
 */

//var Db = require("../resources/database");
//db = new Db();

 
exports.index = function(req, res){
  res.render('index', { 
    user: req.session.user 
  });
}
exports.newUser = function(req, res)
{
    
}
exports.login = function (req, res) {
  
  if (req.body.name == 'admin' && req.body.password == 'admin') {
    console.log("login success!");
    req.session.user = {name: 'admin'}
    res.redirect('/');
  } else {
    console.log("login fails!");
    res.send('Bad user/pass');
  }
  /*db.users.findOne({ username: req.body.user.name }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user = { name: user.name }

      // Remember me
      *
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/documents');
        });
      } else {
      *
        res.redirect('back');
      //}
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/');
    }
  }); 
  */
}
exports.logout = function (req, res) {
  delete req.session.user;
  res.redirect('/');
}