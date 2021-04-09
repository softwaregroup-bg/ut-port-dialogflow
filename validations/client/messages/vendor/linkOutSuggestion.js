module.exports = joi => joi.object().keys({
    destinationName: joi.string(),
    uri: joi.string()
});
