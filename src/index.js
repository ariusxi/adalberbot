'use strict'

// Libs
const { Client } = require('discord.js');

// Configs
const commandCall = require('./utils/functions/command');
const { prefix, token } = require('../config.json');

// Initialize client
const client = new Client();

// Initialize queue
global.queue = new Map();

// Ready
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async (message) => {
    // Verificando se o autor da mensagem é o bot
    if (message.author.bot) return;

    // Verificando se a mensagem não inicia com o prefixo
    if (!message.content.startsWith(prefix)) return;

    // Inicializando fila de mensagens
    const serverQueue = queue.get(message.guild.id);

    return commandCall(message.content, message, serverQueue);
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