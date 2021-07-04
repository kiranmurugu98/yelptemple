//required the needee
const stringifyBoolean = require('@mapbox/mapbox-sdk/services/service-helpers/stringify-booleans');
let mongoose = require('mongoose');
//require the review js file
let Review = require('./reviewtemple');
//user schema
let User = require('./userSchema')

//let autopopulate = require('mongoose-autopopulate');
//including the schema
//let Schema = mongoose.Schema;

//image schema
const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

//redefine the path(for hight and width property)
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
//setting virtuals to true
const opts = { toJSON: { virtuals: true } };
//defining the schema
let templeSchema = new mongoose.Schema({
    title: String,
    special: String,
    mortimein: String,
    mortimeout: String,
    aftimein: String,
    aftimeout: String,
    website: String,
    contact: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    img: [ImageSchema],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'//, autopopulate: true
        }
    ]
}, opts);

templeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<b><a href='/index/${this._id}'>${this.title}</a></b>`
});
//campgroundSchema.plugin(autopopulate);

//deleting the review commands over with campgroundSchema

templeSchema.post('findOneAndDelete', async function (fetch) {
    //console.log(fetch)
    if (fetch) {
        await Review.deleteMany({
            _id: {
                $in: fetch.reviews
            }
        })
    }
})


//exporting the model
module.exports = mongoose.model('Temple', templeSchema);