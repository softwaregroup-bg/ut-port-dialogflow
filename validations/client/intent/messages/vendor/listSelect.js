const joi = require('joi');
const items = require('./fragments/items');
module.exports = joi.object().keys({
    title: joi.string(),
    items
});
