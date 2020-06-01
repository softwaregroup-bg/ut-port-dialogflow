const joi = require('joi');
module.exports = joi.object().keys({
    destinationName: joi.string(),
    uri: joi.string()
});
