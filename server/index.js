const app = require('express')(),
    http = require('http'),
    fs = require('fs'),
    archiver = require('archiver'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    server = http.createServer(app),
    FormData = require('form-data');
    
String.prototype.insertAt = function(i, s) {
  if (i < 0) i = 0;
  if (i > this.length) i = this.length;
  return this.slice(0, i) + s + this.slice(i)
};

app.set('port',3000);   
app.use(bodyParser.text());
app.use(bodyParser.json());

app.post('/request/startup', (req, res) => {
    res.sendStatus(200);
    req = JSON.parse(req.body)
    console.log(req)
});

app.post("/request/login", (req, res) => {
    res.sendStatus(200);
    req = JSON.parse(req.body)
    console.log(req)
})

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${app.get('port')}`);
});


