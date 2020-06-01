const joi = require('joi');
const vendor = require('../vendor');
const custom = {
    actions: require('./actions'),
    image: require('./image'), // maybe don't override but reuse vendor image format
    location: require('./location'), // maybe we can reuse vendor card or basicCard format
    quick: require('./quick'),
    list: require('./list')
};

module.exports = {
    payload: joi.alternatives().try(
        Object.entries({...vendor, ...custom})
            .map(([type, schema]) => {
                return schema.append({
                    type: joi.string().valid(type).default(type).example(type).description('message type')
                });
            })
    )
};
