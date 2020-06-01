const joi = require('joi');
const image = require('./fragments/image');
const buttons = require('./fragments/buttons');
module.exports = joi.object().keys({
    title: joi.string(),
    subtitle: joi.string(),
    formattedText: joi.string(),
    image,
    buttons
});
