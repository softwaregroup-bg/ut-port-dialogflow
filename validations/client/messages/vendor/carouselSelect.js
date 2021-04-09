module.exports = joi => joi.object().keys({
    items: require('./fragments/items')(joi)
});
