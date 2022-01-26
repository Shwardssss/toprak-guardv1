const { Discord, Client, MessageEmbed, ReactionUserManager } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require('./ayarlar.json');
const fs = require('fs');

client.on('ready', async () => {
  client.user.setStatus("idle");
  setInterval(() => {
      const am = [
       "Toprak 💛 Sunucu",
       "Toprak 💚 Sunucu",
       "Toprak 💜 Sunucu",
       "Toprak 🧡 Sunucu",
       "Toprak 💓 Sunucu",
       "Toprak 💙 Sunucu",
       "Toprak 🤎 Sunucu",
       "Toprak 🖤 Sunucu",
       "Toprak 🤍 Sunucu"

      ];
  const yarrak = Math.floor(Math.random() * (am.length));
  client.user.setActivity(`${am[yarrak]}`, {type: "LISTENING"});
}, 10000);
let yarram = client.channels.cache.get(ayarlar.sesamk);
if (yarram) yarram.join().catch(err => console.error("Ses kanalına giriş başarısız"));
console.log(`${client.user.tag} Kullanıma Hazır.`);
});


client.on('voiceStateUpdate', async (___, newState) => {
  if (
  newState.member.user.bot &&
  newState.channelID &&
  newState.member.user.id == client.user.id &&
  !newState.selfDeaf
  ) {
  newState.setSelfDeaf(true);
  }
  });


  client.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
    if (message.author.id !== ayarlar.botOwner && message.author.id !== message.guild.owner.id) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);
    let embed = new MessageEmbed().setColor("ORANGE").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(ayarlar.altbaslık).setTimestamp();
    
    if (command === "eval" && message.author.id === ayarlar.botOwner) {
      if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
        message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
      } catch(err) { message.channel.send(err, {code: "js", split: true}) };
    };


  if (command === "ekle") {
    let hedef;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (rol) hedef = rol;
    if (uye) hedef = uye;
      if (rol) hedef = rol;
      if (uye) hedef = uye;
      let guvenliler = ayarlar.whitelist || [];
      if (!hedef) return message.channel.send(embed.setDescription(`Güvenli Listeye Eklemek İçin ` + "`.ekle ID/@kullanıcı`").addField("Güvenli Liste", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n') : "`Liste boş`"));
      if (guvenliler.some(g => g.includes(hedef.id))) {
        guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
        ayarlar.whitelist = guvenliler;
        fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(`${hedef} ` + "`Güvenli listeden kaldırıldı.`");
      } else {
        ayarlar.whitelist.push(`y${hedef.id}`);
        fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(`${hedef} ` + "`Güvenli listeye eklendi.`");
      };
    };
  
    client.on('message', function() {
      { 
       var interval = setInterval (function () {
         process.exit(0);
       }, 1 * 14400000); 
     }
   });

   function ytKapat(guildID) {
    let sunucu = client.guilds.cache.get(ayarlar.guildID);
    if (!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
      await r.setPermissions(0);
    });
  };
  

  if(command === "ayarlamalar")  {
    let korumalar = Object.keys(ayarlar).filter(k => k.includes('Guard'));
    if (!args[0] || !korumalar.some(k => k.includes(args[0]))) return message.channel.send(embed.setDescription(`Korumaları aktif etmek veya devre dışı bırakmak için **${ayarlar.botPrefix}ayar <koruma>** yazmanız yeterlidir! **Korumalar:** ${korumalar.map(k => `\`${k}\``).join(', ')}\n**Aktif Korumalar:** ${korumalar.filter(k => ayarlar[k]).map(k => `\`${k}\``).join(', ')}`));
    let koruma = korumalar.find(k => k.includes(args[0]));
    ayarlar[koruma] = !ayarlar[koruma];
    fs.writeFile("./ayarlar.json", JSON.stringify(ayarlar), (err) => {
      if (err) console.log(err);
    });
    message.channel.send(embed.setDescription(`**${koruma}** koruması, ${message.author} tarafından ${ayarlar[koruma] ? "aktif edildi" : "devre dışı bırakıldı"}!`));
  };
});




function guvenli(kisiID) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.whitelist || [];
  if (!uye || uye.id === client.user.id || uye.id === ayarlar.botOwner || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};

const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];
function cezalandir(kisiID, tur) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  if (!uye) return;
  if (tur == "jail") return uye.roles.cache.has(ayarlar.boosterRole) ? uye.roles.set([ayarlar.boosterRole, ayarlar.jailRole]) : uye.roles.set([ayarlar.jailRole]);
  if (tur == "ban") return uye.ban({ reason: "Toprak tarafından banlandı." }).catch();
};




client.on("guildMemberRemove", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.kickGuard) return;
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Sağ Tık Kick').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı sağ tık kick attı** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});



client.on("guildBanAdd", async (guild, user) => {
  let entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || !ayarlar.banGuard) return;
  guild.members.unban(user.id, "Kullanıcının banı kaldırıldı.").catch(console.error);
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Sağ Tık Ban').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı sağ tık ban attı** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.on("guildMemberUpdate", async (oldMember, newMember) => {
    let entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.roleGuard) return;
     //cezalandir(entry.executor.id, "jail");
     newMember.roles.set(oldMember.roles.cache.map(r => r.id));
    let logKanali = client.channels.cache.get(ayarlar.logChannelID);
    if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Sağ Tık Rol').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı sağ tık rol verdi** \n —————————————— \n **Verilen Roller Geri Alındı** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});



client.on("guildMemberAdd", async member => {
  let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
  if (!member.user.bot || !entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.botGuard) return;
  cezalandir(entry.executor.id, "ban");
  let sunucu = client.guilds.cache.get(ayarlar.guildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  });
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Bot Ekleme').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı bot ekledi** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.on("guildUpdate", async (oldGuild, newGuild) => {
  let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.serverGuard) return;
  cezalandir(entry.executor.id, "ban");
  let sunucu = client.guilds.cache.get(ayarlar.guildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  });
  if (!newGuild.setName(ayarlar.sunucu));
  if (!newGuild.setIcon(ayarlar.sunucuresim));
  if (!newGuild.setBanner(ayarlar.sunucubanner));
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Sunucu Ayarı').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı sunucu ayarlarıyla oynadı** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.on("channelCreate", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  cezalandir(entry.executor.id, "ban");
  channel.delete({reason: "Toprak"});
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Kanal Açıldı').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı kanal açtı** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  cezalandir(entry.executor.id, "jail");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Kanal Güncellendi').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı kanalı güncelledi** \n —————————————— \n **Kullanıcıyı cezalandırdım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});



client.on("channelDelete", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  await channel.clone({ reason: "Toprak kanal" }).then(async kanal => {
    if (channel.parentID != Toprak) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
  });
  let sunucu = client.guilds.cache.get(ayarlar.guildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  });
  cezalandir(entry.executor.id, "ban");
  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Kanal Silindi').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı kanal sildi** \n —————————————— \n (${channel.name} (${channel.id}) \n —————————————— \n **Yöneticileri kapattım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.on("roleCreate", async role => {
  let entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_CREATE' }).then(audit => audit.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  await role.delete({ reason: "Zeox Rol Koruması" });
  let sunucu = client.guilds.cache.get(ayarlar.guildID);
  if (!sunucu) return;
  sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  });
  cezalandir(entry.executor.id, "ban");
    let logKanali = client.channels.cache.get(ayarlar.logChannelID);
    if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Rol Oluşturma').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı rol açtı** \n —————————————— \n **Yöneticileri kapattım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
  });


client.on("roleDelete", async role => {
let entry = await role.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_DELETE' }).then(x => x.entries.first());
if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
cezalandir(entry.executor.id, "ban");
let sunucu = client.guilds.cache.get(ayarlar.guildID);
if (!sunucu) return;
sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
  await r.setPermissions(0);
});
let logKanali = client.channels.cache.get(ayarlar.logChannelID);
if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Rol Silme').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı rol sildi** \n —————————————— \n (${role.name} (${role.id}) \n —————————————— \n Rol Bilgileri Yukarıda Verilmiştir. \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});

client.on("roleUpdate", async (oldRole, newRole, ) => {
  let entry = await newRole.guild.fetchAuditLogs({ limit: 1, type: 'ROLE_UPDATE' }).then(x => x.entries.first());
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || guvenli(entry.executor.id) || !ayarlar.channelGuard) return;
  cezalandir(entry.executor.id, "jail");
  if (yetkiPermleri.some(x => !oldRole.permissions.has(x) && newRole.permissions.has(x))) {
      newRole.setPermissions(oldRole.permissions);
  };
  newRole.edit({ ...oldRole });

  let logKanali = client.channels.cache.get(ayarlar.logChannelID);
  if (logKanali) { logKanali.send(new MessageEmbed().setColor("RED").setTitle('Rol Güncelleme').setDescription(`${entry.executor} - ${entry.executor.id} \n\n —————————————— \n **Kullanıcısı rol güncelledi** \n —————————————— \n **Yöneticileri kapattım** \n  ——————————————`).setFooter(ayarlar.altbaslık).setTimestamp()).catch();}
});


client.login(ayarlar.botToken).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));