'use strict'

// Libs
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

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

    const embed = new MessageEmbed()
            .setTitle(`Começou a tocar:`)
            .setThumbnail(song.thumbnail)
            .addFields({
                name: 'Título',
                value: song.title,
            }, {
                name: 'URL',
                value: song.url,
            });

    serverQueue.textChannel.send(embed);
}

const queue = async (message, serverQueue) => {
    const voiceChannel = message.member.voice.channel;
    
    // Verificando se o usuário está em um canal de voz
    if (!voiceChannel) {
        return message.channel.send('Você precisa estar em um canal para reproduzir músicas');
    }

    // Verificando as permissões atuais do canal
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('Eu preciso de permissões para me juntar ao canal de voz');
    }

    // Verificando se a fila de músicas contém alguma coisa
    if (!serverQueue || !serverQueue.songs || serverQueue.songs.length === 0) {
        return message.channel.send('A fila de músicas está vazia');
    }

    // Listar todas as músicas que tem na fila
    serverQueue.songs.forEach((currentSong) => {
        const embed = new MessageEmbed()
            .setTitle(`Música adicionada a fila`)
            .setThumbnail(currentSong.thumbnail)
            .addFields({
                name: 'Título',
                value: currentSong.title,
            }, {
                name: 'URL',
                value: currentSong.url,
            }, {
                name: 'Repetições',
                value: currentSong.repetition,
            }, {
                name: 'Adicionar por',
                value: currentSong.addedBy,
            });

        serverQueue.textChannel.send(embed);
    });

    console.log(serverQueue);
}

const execute = async (message, serverQueue) => {
    const args = message.content.split(' ');
    const videoUrl = args[1];
    const repetition = args[2] ? args[2] : 1;
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
        thumbnail: songInformation.videoDetails.thumbnails[0].url,
        url: songInformation.videoDetails.video_url,
        addedBy: message.member.user.tag,
        repetition,
    });

    if (!serverQueue) {
        const queueConstruct = ({
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        });

        const embed = new MessageEmbed()
            .setTitle(`Música adicionada na fila`)
            .setThumbnail(song.thumbnail)
            .addFields({
                name: 'Título',
                value: song.title,
            }, {
                name: 'URL',
                value: song.url,
            }, {
                name: 'Repetições',
                value: repetition,
            },{
                name: 'Adicionada por',
                value: song.addedBy,
            });

        // Adicionando o aviso de que foi adicionado na fila a música
        message.channel.send(embed);

        // Adicionando informações da música na fila
        global.queue.set(message.guild.id, queueConstruct);
        
        for (let i = repetition; i > 0; i--) {
            queueConstruct.songs.push(song);
        }

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
    queue,
}