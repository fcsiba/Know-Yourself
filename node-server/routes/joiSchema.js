const Joi = require('joi');

const updateTwitterTagSchema = Joi.object({
    tag: Joi.string().required()
});

const updateSaveSettingSchema = Joi.object({
    facebook_save: Joi.bool().required(),
    twitter_save: Joi.bool().required(),
});

module.exports = {
    updateTwitterTagSchema,
    updateSaveSettingSchema
}