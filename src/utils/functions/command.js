'use strict'

const moduleCall = require('./module');
const { getPrefix } = require('./prefix');

module.exports = (command, message, serverQueue) => {
    // Resgatando prefixo do comando
    const prefix = getPrefix(command);
    // Definindo módulos do bot
    const modules = ((prefixName) => ({
        'help': moduleCall('help'),
        'play': moduleCall('music', 'execute'),
        'skip': moduleCall('music', 'skip'),
        'stop': moduleCall('music', 'stop'),
        'roll': moduleCall('dice', 'roll'),
        'historic-rolls': moduleCall('dice', 'historic'),
        'calculate': moduleCall('math'),
        'generate-group': moduleCall('group'),
        'initiative-roll': moduleCall('initiative', 'initiativeRoll'),
        'initiative-group': moduleCall('initiative', 'initiativeGroupOrder'),
        'initiative-clear': moduleCall('initiative', 'initiativeClear'),
    })[prefixName]);

    // Verificando se o prefixo enviado tem uma função existente
    const moduleFunction = modules(prefix);
    if (!moduleFunction) {
        return message.channel.send(`Comando inválido!`);
    }

    return moduleFunction(message, serverQueue);
}