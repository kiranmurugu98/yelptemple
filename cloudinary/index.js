//cloudinary require from docs
let cloudinary = require('cloudinary').v2;
let { CloudinaryStorage } = require('multer-storage-cloudinary');
//configure the key (env)
cloudinary.config({
    cloud_name: process.env.NAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET
})

//storage files properties

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpg', 'jpeg', 'png']
    }

})


module.exports = {
    cloudinary,
    storage
}