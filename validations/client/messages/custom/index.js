const vendor = require('../vendor');
module.exports = joi => ({
    payload: joi.alternatives().try(
        ...Object.entries({
            ...vendor(joi),
            actions: require('./actions')(joi),
            image: require('./image')(joi), // maybe don't override but reuse vendor image format
            location: require('./location')(joi), // maybe we can reuse vendor card or basicCard format
            quick: require('./quick')(joi),
            list: require('./list')(joi)
        })
            .map(([type, schema]) => {
                return schema.append({
                    type: joi.string().valid(type).default(type).example(type).description('message type')
                });
            })
    )
});
