module.exports = joi => joi.object().keys({
    title: joi.string(),
    subtitle: joi.string(),
    imageUri: joi.string(),
    buttons: require('./fragments/buttons')(joi)
});
