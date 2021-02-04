'use strict'

const { prefix } = require('./../../config.json');

module.exports = (message) => {
    // Inicializando grupo de comandos
    let helpTextMessage = "```";

    // Agrupando mensagens dos comandos
    helpTextMessage = `${helpTextMessage} ${prefix}play - Para reproduzir um link do Youtube\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}skip - Para pular a música atual\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}stop - Para parar a música atual\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}roll - Para efetuar uma rolagem de dado\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}historic-rolls - Para ver o seu histórico de rolagens de dado\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}calculate - Para efetuar cálculo de operações\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}generate-group members quantity - Para criar grupos dividos por nomes\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}initiative-roll - Para rodar sua iniciativa\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}initiative-group - Para ver a ordem da iniciativa\n`;
    helpTextMessage = `${helpTextMessage} ${prefix}initiative-clear - Para limpar a ordem da iniciativa\n`;

    message.channel.send(`Aqui está a lista de comandos, use com sabedoria: `);

    return message.channel.send(helpTextMessage + "```");
}