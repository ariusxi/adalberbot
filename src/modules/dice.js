'use strict'

// Libs
const moment = require('moment');
const Dice = require('node-dice-js');

// Queue of dices
const historicDices = [];

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

module.exports = {
    roll,
    historic,
}