'use strict'

// Libs
const { Client } = require('discord.js');

// Configs
const commandCall = require('./utils/functions/command');
const { prefix, token } = require('../config.json');
const jimp = require('jimp');

// Initialize client
global.client = new Client();

// Initialize queue
global.queue = new Map();
global.games = new Map();

// Ready
global.client.once('ready', () => {
    console.log('Ready!');

    // Definindo atividade padrão do bot
    client.user.setPresence({
        game: {
            name: `${prefix}help`,
            type: 'PLAYING',
        },
        status: 'online',
    });

    // Definindo username do bot
    client.user.setUsername('Arthambot');
});

global.client.on('message', async (message) => {
    // Verificando se o autor da mensagem é o bot
    if (message.author.bot) return;

    // Verificando se a mensagem não inicia com o prefixo
    if (!message.content.startsWith(prefix)) return;

    // Inicializando fila de mensagens
    const serverQueue = queue.get(message.guild.id);

    return commandCall(message.content, message, serverQueue, client);
});

global.client.on('guildMemberAdd', async (member) => {
    let wChan = db.fetch(`welcome_${member.guild.id}`);

    if (wChan === null) return;

    if (!wChan) return;

    let font64 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
    let bfont64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    let mask = await jimp.read('https://i.imgur.com/552kzaW.png');
    let welcome = await jimp.read('https://t.wallpaperweb.org/wallpaper/nature/1920x1080/greenroad1920x1080wallpaper3774.jpg');

    jimp.read(member.user.displayAvatarURL({ format: 'png' })).then((avatar) => {
        avatar.resize(200, 200);
        mask.resize(200, 200);
        avatar.mask(200, 200);
        welcome.resize(1000, 300);

        welcome.print(font64, 265, 55, `Bem vindo ${member.user.username}`);
        welcome.print(bfont64, 265, 125, `Para ${member.guild.name}`);
        welcome.print(font64, 255, 195, `Temos agora ${member.guild.memberCount} membros`);
        welcome.composite(avatar, 40, 55).write('https://th.bing.com/th/id/R0fb7961a7e9309f6cad5e953916b4016?rik=cnkac0B81dAN8Q&riu=http%3a%2f%2fwww.pbh2.com%2fwordpress%2fwp-content%2fuploads%2f2013%2f05%2fcutest-corgi-gifs-excited.gif&ehk=x1xkUiZPcUTSdkQZsDpARp04WkiWrNgQFaJflhts%2f6g%3d&risl=1&pid=ImgRaw');
        try {
            member.guild.channels.cache.get(wChan).send(``, {
                files: ['https://th.bing.com/th/id/R0fb7961a7e9309f6cad5e953916b4016?rik=cnkac0B81dAN8Q&riu=http%3a%2f%2fwww.pbh2.com%2fwordpress%2fwp-content%2fuploads%2f2013%2f05%2fcutest-corgi-gifs-excited.gif&ehk=x1xkUiZPcUTSdkQZsDpARp04WkiWrNgQFaJflhts%2f6g%3d&risl=1&pid=ImgRaw'],
            });
        } catch (e) {
            console.error(e);
        }
    });
});

// Reconnecting
global.client.once('reconnecting', () => {
    console.log('Reconnecting');
});

// Disconnecting
global.client.once('disconnect', () => {
    console.log('Disconnect!');
});

global.client.login(token);