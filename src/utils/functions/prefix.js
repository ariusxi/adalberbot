'use strict'

const { prefix } = require('./../../../config.json');

exports.getPrefix = (messageText) => {
    return messageText.split(' ')[0].replace(prefix, '');
}