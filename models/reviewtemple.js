let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewcampSchema = new Schema({
    body: String,
    rating: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewcampSchema);




//Review.insertMany({ body: 'Hello', rating: 5 }, { body: 'buddy', rating: 7 });