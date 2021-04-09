const vendor = require('./vendor');
const custom = require('./custom');
module.exports = joi => Object.entries({
    ...vendor(joi),
    ...custom(joi)
}).map(([key, schema]) => {
    return joi.object().keys({
        [key]: schema,
        platform: joi.string().valid(
            'PLATFORM_UNSPECIFIED',
            'FACEBOOK',
            'SLACK',
            'TELEGRAM',
            'KIK',
            'SKYPE',
            'LINE',
            'VIBER',
            'ACTIONS_ON_GOOGLE'
        )
    });
});
