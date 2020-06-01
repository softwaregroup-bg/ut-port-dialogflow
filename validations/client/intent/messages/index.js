const joi = require('joi');
const vendor = require('./vendor');
const custom = require('./custom');
module.exports = Object.entries({...vendor, ...custom}).map(([key, schema]) => {
    return joi.object().keys({
        [key]: schema,
        platform: joi.string().valid([
            'PLATFORM_UNSPECIFIED',
            'FACEBOOK',
            'SLACK',
            'TELEGRAM',
            'KIK',
            'SKYPE',
            'LINE',
            'VIBER',
            'ACTIONS_ON_GOOGLE'
        ])
    });
});
