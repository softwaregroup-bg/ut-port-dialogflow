const joi = require('joi');
module.exports = {
    description: 'Batch delete entity types',
    params: joi.any(),
    result: joi.any()
};
