const { player } = require(".");

module.exports = async (client, msg, args, command) => {
  if (command === "tocar") {
    const channel = msg.member.voice.channel;
    if (!channel)
      return msg.channel.send("Você precisa estar em um canal de voz!");

    const search_music = args.join(" ");
    if (!search_music)
      return msg.channel.send("Digite o nome ou link da musica!");

    const queue = player.createQueue(msg.guild.id, {
      metadata: {
        channel: msg.channel,
      },
    });

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (error) {
      queue.destroy();
      return await msg.reply({
        content: "Não foi possível entrar no server!",
        ephemeral: true,
      });
    }

    const song = await player
      .search(search_music, {
        requestedBy: msg.author,
      })
      .then((x) => x.tracks[0]);
    client.user.setActivity(song.title, { type: "LISTENING" });
    if (!song) return msg.reply(`Erro ao procurar música: ${search_music}!`);
    queue.play(song);

    msg.channel.send({ content: `⏳ | Procurando... **${song.title}**!` });
  } else if (command === "pular") {
    const queue = player.getQueue(msg.guild.id);
    queue.skip();
    msg.channel.send(`Proxima música...`);
  } else if (command === "parar") {
    const queue = player.getQueue(msg.guild.id);
    queue.stop();
    msg.channel.send(`Parei!`);
  } else if (command === "pause") {
    const queue = player.getQueue(msg.guild.id);
    queue.setPaused(true);
    msg.channel.send(`Pausada...`);
  } else if (command === "despause") {
    const queue = player.getQueue(msg.guild.id);
    queue.setPaused(false);
    msg.channel.send(`Música despausada...`);
  }
};
