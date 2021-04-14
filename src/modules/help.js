'use strict'

const { prefix } = require('./../../config.json');

exports.help = (message) => {
    // Agrupando mensagens dos comandos
    let helpTextMessage = [
        `${prefix}play - Para reproduzir um link do Youtube`,
        `${prefix}skip - Para pular a música atual`,
        `${prefix}stop - Para parar a música atual`,
        `${prefix}roll - Para efetuar uma rolagem de dado`,
        `${prefix}historic-rolls - Para ver o seu histórico de rolagens de dado`,
        `${prefix}calculate - Para efetuar cálculo de operações`,
        `${prefix}generate-group members quantity - Para criar grupos dividos por nomes`,
        `${prefix}initiative-roll - Para rodar sua iniciativa`,
        `${prefix}initiative-group - Para ver a ordem da iniciativa`,
        `${prefix}initiative-clear - Para limpar a ordem da iniciativa`,
    ];

    message.channel.send(`Aqui está a lista de comandos, use com sabedoria: `);

    return message.channel.send(helpTextMessage);
}

exports.customHelp = (message) => {
    // Agrupando mensagens dos comandos
    let helpTextMessage = [
        `${prefix}fomi`,
        `${prefix}pedemesa`,
        `${prefix}vouteroubei`,
        `${prefix}chadecogumelo`,
        `${prefix}desnecessauro`,
        `${prefix}bonk`
    ];

    message.channel.send(`Pelo visto você realmente gosta de piadas né? Toma aqui as minhas: `);

    return message.channel.send(helpTextMessage);
}