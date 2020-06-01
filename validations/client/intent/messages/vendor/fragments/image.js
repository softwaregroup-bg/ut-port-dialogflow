const joi = require('joi');
module.exports = joi.object().keys({
    imageUri: joi.string(),
    accessibilityText: joi.string()
});
