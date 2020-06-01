const joi = require('joi');
const buttons = require('./fragments/buttons');
module.exports = joi.object().keys({
    title: joi.string(),
    subtitle: joi.string(),
    imageUri: joi.string(),
    buttons
});
