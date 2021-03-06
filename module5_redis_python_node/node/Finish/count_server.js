var redis = require("redis");
var client = redis.createClient(6379, "<redis-name>.redis.cache.windows.net", {auth_pass: '<access_key>', return_buffers: true});
var http = require('http');
http.createServer(function (req, res) {

  var ip = req.connection.remoteAddress || req.headers['x-forwarded-for'];
  client.pfadd('clientips', ip, function(err){
    if(err){
      return res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error talking to redis ' + err + '\n');
    }
    
    client.pfcount('clientips', function(err, count){
      res.writeHead(500, {'Content-Type': 'text/plain'});

      return res.end('Hello ' + ip + '\n about ' + count + ' unique connections have visited this site!');
      
    });
  });

  
}).listen(process.env.PORT || 1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + (process.env.PORT || 1337));
