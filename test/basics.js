var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request");

describe('init', function() {
  
  it('server start as daemon', function(done) {
    exec('node index --start --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      console.log(stdout);
      done();
    })
  });
  
  it('/login   (fail)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
        "password": "aadmin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      done();
    });
  });
  
  it('/login   (success)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
        "password": "admin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('/login   (already logged in)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
        "password": "admin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('/logout', function(done) {
    request.get({url: 'http://localhost:3000/logout', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('/device.json', function(done) {
    request.get({url: 'http://localhost:3000/device.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('/event.json', function(done) {
    request.get({url: 'http://localhost:3000/event.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('/schedule.json', function(done) {
    request.get({url: 'http://localhost:3000/schedule.json', json:true}, 
      function(err, res, body){
      
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      done();
    });
  });
  
  it('/action.json', function(done) {
    request.get('http://localhost:3000/action.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      assert.equal(body[0].name, "owPing");
      assert.equal(body[0].script, "ow.ping();");
      assert.equal(body[0].type, "script");
      assert.equal(body[1].name, "owReadAll");
      assert.equal(body[1].script, "ow.readAll();");
      assert.equal(body[1].type, "script");
      done();
    });
  });
  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --stop --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      done();
    });
  });
});  