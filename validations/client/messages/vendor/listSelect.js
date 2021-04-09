module.exports = joi => joi.object().keys({
    title: joi.string(),
    items: require('./fragments/items')(joi)
});
