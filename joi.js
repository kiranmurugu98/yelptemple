//require the neede
let RequireJoi = require('joi');
let sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': 'HYY! Cheater!!{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});



const Joi = RequireJoi.extend(extension)

//validating the input by joi .....serverside....
module.exports.campSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    //img: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array(),
    mortimein: Joi.string(),
    mortimeout: Joi.string(),
    aftimein: Joi.string(),
    aftimeout: Joi.string(),
    contact: Joi.number().max(9999999999),
    special: Joi.string().escapeHTML(),
    website: Joi.string().escapeHTML()



}).required()



module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()

}).required()