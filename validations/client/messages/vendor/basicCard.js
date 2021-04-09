module.exports = joi => joi.object().keys({
    title: joi.string(),
    subtitle: joi.string(),
    formattedText: joi.string(),
    image: require('./fragments/image')(joi),
    buttons: require('./fragments/buttons')(joi)
});
