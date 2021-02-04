'use strict'

// Libs
const Dice = require('node-dice-js');

// Initiative list
let initiativeGroupList = [];

const initiativeRoll = (message) => {
    const dice = new Dice();
    const args = message.content.split(' ');
    const currentDice = args[1];

    console.log(`Executing current dice: ${currentDice}`);

    // Pegando o resultado do dado atual
    const resultDice = dice.execute(args[1]);

    // Formatando resultado do dado
    const currentResultDice = resultDice.text.replace(`The result of ${currentDice} is`, '');

    initiativeGroupList.push({
        dice: currentDice,
        user: args.length > 2 ? args[2] : message.author.username,
        result: resultDice.outcomes[0].total,
    });

    return message.channel.send(`Sua iniciativa é ${currentResultDice}`);
}

const initiativeGroupOrder = (message) => {
    // Ordenando as iniciativas em ordem decrescente
    const initiativeGroupOrderDesc = initiativeGroupList.sort((a, b) => {
        return a.result > b.result;
    });

    // Mostrando os resultados de iniciativa
    initiativeGroupOrderDesc.map((currentInitiative) => {
        return message.channel.send(`${currentInitiative.user}: ${currentInitiative.result}`);
    });
}

const initiativeClear = (message) => {
    // Limpando grupo de iniciativa
    initiativeGroupList = [];

    return message.channel.send(`Fila de iniciativa limpa`);
}

module.exports = {
    initiativeRoll,
    initiativeGroupOrder,
    initiativeClear,
}