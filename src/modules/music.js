'use strict'

// Libs
const ytdl = require('ytdl-core');

const skip = (message, serverQueue) => {
    if (!message.member.voice.channel) {
        return message.channel.send('Você precisa estar em canal de voz para pular a música');
    }
    if (!serverQueue) {
        return message.channel.send('Não tem mais músicas pra tocar');
    }
    serverQueue.connection.dispatcher.end();
}

const stop = (message, serverQueue) => {
    if (!message.member.voice.channel) {
        return message.channel.send('Você precisa estar em canal de voz para parar a música')
    }
    if (!serverQueue) {
        return message.channel.send('Não há músicas que eu possa parar');
    }
    
    // Resetando fila de músicas
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

const play = (guild, song) => {
    const serverQueue = global.queue.get(guild.id);
    console.log(global.queue);
    if (!song) {
        serverQueue.voiceChannel.leave();
        global.queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Começou a tocar: **${song.title}**`);
}

const execute = async (message, serverQueue) => {
    const args = message.content.split(' ');
    const videoUrl = args[1];
    const voiceChannel = message.member.voice.channel;

    // Verificando se o usuário está em um canal de voz
    if (!voiceChannel) {
        return message.channel.send('Você precisa estar um canal para reproduzir músicas');
    }

    // Verificando permissões atuais do canal
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('Eu preciso de permissões para me juntar ao canal de voz');
    }

    // Verificando informações da música enviada
    const songInformation = await ytdl.getInfo(videoUrl).catch(() => {
        return message.channel.send(`Desculpe, não foi possível reproduzir essa música`);
    });
    const song = ({
        title: songInformation.videoDetails.title,
        url: songInformation.videoDetails.video_url,
    });

    if (!serverQueue) {
        const queueConstruct = ({
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        });

        // Adicionando informações da música na fila
        global.queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            // Efetuando conexão ao chat de voz
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            global.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
}

module.exports = {
    skip,
    stop,
    play,
    execute,
}