'use strict'

/**
 * @param {String} moduleName The name of the module you'll call
 * @description Método para chamar um módulo específico do bot
 * @return {Function} 
 */
module.exports = (moduleName, functionName = null) => {
    if (functionName) {
        return require(`../../modules/${moduleName}`)[functionName];
    }
    return require(`../../modules/${moduleName}`);
}