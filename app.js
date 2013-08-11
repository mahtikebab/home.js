/************************************************************
 *
 *   NODE-HOME-AUTOMATION
 *   designed by JVA
 *
 *   Code license: GNU GPL v2
 *
 ************************************************************/

 /*
 * 
 * Module dependencies.
 */
var 
    //node.js modules:
    express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , cluster = require('cluster')
  
  // 3rd party modules:
  , Resource = require('express-resource')
  , email = require('emailjs')
  , colors = require('colors')
  , config = require('./config')
  , winston = require('winston')
  //, winstonExpress = require('winston-express')
  , cli = require('optimist')
    .usage('Usage: npm start]')
    
    .boolean(['f', 'd'])
    
    //.demand(['x','y'])
    .default('f', false)
    .alias('f', 'fork')
    
    .default('p', 8080)
    .alias('p', 'port')
    
    .default('d', false)
    .alias('d', 'start')
    
  , argv = cli.argv
  , SessionStore = require("session-mongoose")(express);
  
if( argv.help || argv.h ){
  cli.showHelp();
  process.exit();
}

if (cluster.isMaster && argv.fork) {
    var cpus = require('os').cpus().length;
    for (var i = 0; i < cpus; i++) {
        cluster.fork();
    }
    return;
}

if( argv.d ) {
  winston.add(winston.transports.File, 
      { filename: __dirname + '/log/homejs.log',
        colorize: false
      }).remove(winston.transports.Console);
}
winston.info('Initializing..');
global.CFG = config.init(argv);
global.winston = CFG;

/** Load configurations and cronjob */
var cronservice = require("./app/services/cron.js")
  , Db = require("./app/resources/database");
  
var app = express();
var cron = new cronservice();
//cron.start();

global.db = new Db();

// Change process title
process.title = 'home.js';

//change current working directory (required for git pull)
//process.chdir(require('path').dirname(require.main.filename)); 

app.configure(function(){
  
  app.set('port', CFG.app.port);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  
  //winstonExpress(app, winston);
  
  // enable web server logging; pipe those log messages through winston
  var winstonStream = {
      write: function(message, encoding){
          winston.info(message);
      }
  };
  app.use(express.logger({stream:winstonStream, format: ':remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time' }));
  //app.use(express.logger('dev'));
  app.use(express.compress());
  
  //app.use(express.staticCache());
  
  //these files shouldn't never change
  app.use(express.static(__dirname + '/public', {maxAge: 86400000})); 
  
  
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('HoMeJs'));
  // mongo session storing - there was some problems with rpi !
  /*var store = new SessionStore({
        url: "mongodb://"+require('./config.json').mongodb.host+"/"+require('./config.json').mongodb.database,
        interval: 120000 // expiration check worker run interval in millisec (default: 60000)
  });*/
  app.use(express.session({
    //store: store,
    cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
  }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  //console.log(req.url);
  res.render('404', { status: 404, url: req.url, user: req.session.user });
});
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  /*res.render('500', {
      status: err.status || 500
    , error: err
  });*/
  winston.error(err);
  //res.send(404);
  next();
});
app.get( '/argv', function( req, res){
  res.json(argv);
});
app.get( '/shutdown', function(req, res, next){
  if( req.query.secret === 'secret' ){
    res.json({shutdown: 'on progress'});
    setTimeout( process.exit, 1000);
  } else next();
});
/**
 * Mount all routes from "routes" -folder.
 */
fs.readdirSync(__dirname + '/app/routes').forEach(function(name){
  var route = require('./app/routes/'+name);
  if( route.disable ){}
  else {
    winston.info('Init routes '+name .cyan);
    route(app);
  }
});

process.on('uncaughtException', function(err) {
  if(err.errno === 'EADDRINUSE'){
    winston.error( ('Sorry, port '+app.get('port')+' is already in use').red);
  } else {
    winston.error('uncaughtException');
    winston.error(err);
  }
  process.exit(1);
});

// Windows doesn't use POSIX signals
if (process.platform === "win32" && argv.d === false) {
  const keypress = require("keypress");
  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  process.stdin.on("keypress", function(char, key) {
    if (key && key.ctrl && key.name == "c") {
        // Behave like a SIGUSR2
        process.emit("SIGINT");
    }
  });
}
process.on('exit', function() {
  winston.log('About to exit.');
});
process.on('SIGINT', function() {
  cron.stop();
  process.exit();
});
app.listen(app.get('port'), function(){
  winston.log("home.js server listening on port " + app.get('port'));
});