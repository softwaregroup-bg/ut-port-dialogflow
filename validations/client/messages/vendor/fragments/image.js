module.exports = joi => joi.object().keys({
    imageUri: joi.string(),
    accessibilityText: joi.string()
});
