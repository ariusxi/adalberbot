'use strict'

// Libs
const stringMath = require('string-math');

module.exports = (message) => {
    // Recuperando o calculo retirando o prefixo
    const args = message.content.split(' ');
    const currentOperation = message.content.replace(`${args[0]} `, '').toString();

    // Convertendo o cálculo e recuperando o resultado
    const resultOperation = stringMath(currentOperation);

    // Mostrando o retorno no chato para o usuário
    return message.channel.send(`${currentOperation} = ${resultOperation}`);
}