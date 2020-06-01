const joi = require('joi');
module.exports = {
    description: 'Batch update entity types',
    params: joi.any(),
    result: joi.any()
};
