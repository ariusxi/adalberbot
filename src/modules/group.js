'use strict'

/**
 * @param {Number} totalMembers 
 * @param {Number} totalGroups
 * @description Método que calcula a quantidade de membros por grupo
 * @return {Number} 
 */
const calculateMembersGroup = (totalMembers, totalGroups) => {
    // Aqui verificamos se o resto da divisão dá um número quebrado, caso seja ele adiciona mais 1
    const resultMembersPerGroup = totalMembers / totalGroups;
    const resultMembersPerGroupInt = parseInt(resultMembersPerGroup);

    if (resultMembersPerGroup > resultMembersPerGroupInt) {
        return parseInt(totalMembers / totalGroups) + 1;
    }
    return parseInt(totalMembers / totalGroups);
}

module.exports = (message) => {
    // Recuperando os parametros de geração do grupo
    const args = message.content.split(' ');
    const members = args[1].split(",");
    const quantityGroups = parseInt(args[2]);
    
    // Calculando quantos membros vão ficar por grupo
    const membersPerGroup = calculateMembersGroup(members.length, quantityGroups);

    if (members.length < quantityGroups) {
        return message.channel.send(`Não tenho como criar uma quantidade de grupos com um número de nomes enviados`);
    }

    let textListGroup = "";
    for (let currentGroup = 1; currentGroup <= quantityGroups; currentGroup++) {
        if (members.length > 0) {
            textListGroup += `**Grupo ${currentGroup}**: `;
            for (let currentMember = 1; currentMember <= membersPerGroup; currentMember++) {
                const currentMemberItem = members.shift();
                textListGroup += currentMemberItem ? ` ${currentMemberItem}` : '';
            }
            textListGroup += "\n";
        }
    }

    return message.channel.send(textListGroup);
}