'use strict'

// Libs
const { Client } = require('discord.js');
const ytdl = require('ytdl-core');
const Dice = require('node-dice-js');
const stringMath = require('string-math');
const moment = require('moment');

// Configs
const { prefix, token } = require('../config.json');

// Initialize client
const client = new Client();
const queue = new Map();
const historicDices = [];

// Ready
client.once('ready', () => {
    console.log('Ready!');
});

const help = (message) => {
    // Inicializando grupo de comandos
    let helpTextMessage = "```";

    // Agrupando mensagens dos comandos
    helpTextMessage = `${helpTextMessage} !play - Para reproduzir um link do Youtube\n`;
    helpTextMessage = `${helpTextMessage} !skip - Para pular a música atual\n`;
    helpTextMessage = `${helpTextMessage} !stop - Para parar a música atual\n`;
    helpTextMessage = `${helpTextMessage} !roll - Para efetuar uma rolagem de dado\n`;
    helpTextMessage = `${helpTextMessage} !historic-rolls - Para ver o seu histórico de rolagens de dado\n`;
    helpTextMessage = `${helpTextMessage} !calculate - Para efetuar cálculo de operações`;

    message.channel.send(`Aqui está a lista de comandos, use com sabedoria: `);

    return message.channel.send(helpTextMessage + "```");
}

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
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
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
    const searchName = message.content.replace(`${args[1]} `, '');
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
    const songInformation = await ytdl.getInfo(searchName).catch(() => {
        return message.channel.send(`Não encontrei nada para ${searchName}`);
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
        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            // Efetuando conexão ao chat de voz
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
}

const roll = (message) => {
    const dice = new Dice();
    const args = message.content.split(' ');
    const currentDice = message.content.replace(`${args[1]} `, '');

    console.log(`Executing current dice: ${currentDice}`);

    // Pegando o resultado do dado atual
    const resultDice = dice.execute(currentDice);

    // Formatando resultado do dado
    const currentResultDice = resultDice.text.replace(`The result of ${currentDice} is`, '');

    historicDices.push({
        dice: currentDice,
        user: message.author.username,
        result: currentResultDice,
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    });

    return message.channel.send(`O resultado do dado ${currentResultDice}`);
}

const historic = (message) => {
    // Pegando o nickname atual do autor
    const currentAuthor = message.author.username;

    // Filtrando os dados do autor atual
    const userDices = historicDices.filter((currentDice) => currentDice.user === currentAuthor);

    if (userDices.length === 0){
        message.channel.send(`Você ainda não teve nenhum roll ainda`);
        return;
    }

    // Mostrando qual usuário que teve o histórico
    message.channel.send(`Histórico de ***${currentAuthor}***: `);

    // Formatando histórico de rolls
    let historicUserText = "```";
    userDices.map((currentUserDice) => {
        // Mostrando o histórico de dados
        historicUserText = `${historicUserText} ${currentUserDice.dice} no dia ${currentUserDice.createdAt} e teve resultado: ${currentUserDice.result}\n`;
    });
    historicUserText = historicUserText + "```";

    // Enviando resultado para o usuário
    message.channel.send(historicUserText);
}

const calculate = (message) => {
    // Recuperando o calculo retirando o prefixo
    const args = message.content.split(' ');
    const currentOperation = message.content.replace(`${args[0]} `, '').toString();

    // Convertendo o cálculo e recuperando o resultado
    const resultOperation = stringMath(currentOperation);

    // Mostrando o retorno no chato para o usuário
    return message.channel.send(`${currentOperation} = ${resultOperation}`);
}

// Commands bot
const botCommands = (message, serverQueue) => {
    // Help command
    if (message.content.startsWith(`${prefix}help`)) {
        help(message);
        return;
    }

    // Play music
    if (message.content.startsWith(`${prefix}play`)) {
        execute(message,serverQueue);
        return;
    }
    // Skip music
    if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    }
    // Stop music
    if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    }
    // Rolls a dice
    if (message.content.startsWith(`${prefix}roll`)) {
        roll(message, serverQueue);
        return;
    }
    // Historic rolls
    if (message.content.startsWith(`${prefix}historic-rolls`)) {
        historic(message);
        return;
    }
    // Calculate
    if (message.content.startsWith(`${prefix}calculate`)) {
        calculate(message);
        return;
    }
    
    // Caso seja um comando inválido
    message.channel.send(`Comando inválido!`);
    return;
}

client.on('message', async (message) => {
    // Verificando se o autor da mensagem é o bot
    if (message.author.bot) return;

    // Verificando se a mensagem não inicia com o prefixo
    if (!message.content.startsWith(prefix)) return;

    // Inicializando fila de mensagens
    const serverQueue = queue.get(message.guild.id);

    return botCommands(message, serverQueue);
});

// Reconnecting
client.once('reconnecting', () => {
    console.log('Reconnecting');
});

// Disconnecting
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.login(token);