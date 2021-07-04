const temple = require('../models/temple');
let CustomError = require('../helpers/customerror')
let { cloudinary } = require('../cloudinary')
let mbxmap = require('@mapbox/mapbox-sdk/services/geocoding')

let mbxtoken = process.env.MAP;
let geocoding = mbxmap({ accessToken: mbxtoken })


module.exports.index = async function (req, res) {
    let id = await temple.find({})
    res.render('components/index', { id })
}

module.exports.newformtemple = function (req, res) {
    res.render('components/new')
}


module.exports.createnewtemple = async function (req, res, next) {

    let geodata = await geocoding.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()


    //adding the user name
    let newdata = new temple(req.body)
    newdata.geometry = geodata.body.features[0].geometry;
    //setting the images
    newdata.img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newdata.user = req.user._id;
    await newdata.save();
    console.log(newdata)
    req.flash('success', 'SuccessFully Created!! New Temple')
    res.redirect(`/index/${newdata._id}`);
}

module.exports.showtemple = async function (req, res, next) {
    try {
        let id = await temple.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'user' } }).populate('user');
        //console.log(id)
        if (!id) {
            req.flash('error', 'File is Deleted  in DB!')
            return res.redirect('/index');
        }
        //console.log(id)
        res.render('components/show', { id })
    } catch (err) {
        next(new CustomError('File Not Found in DB!', 404))
    }
}


module.exports.editform = async function (req, res) {
    let id = await temple.findById(req.params.id)
    res.render('components/edit', { id });

}

module.exports.updatetemple = async function (req, res) {
    let { id } = req.params;
    console.log(req.body)
    //let campid = await Campground.findById(id);
    let updateone = await temple.findByIdAndUpdate(id, req.body, { runValidators: true, new: true, useFindAndModify: false });
    let images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    updateone.img.push(...images)
    await updateone.save()


    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await updateone.update({ $pull: { img: { 'filename': { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'SuccessFully Edited A Temple!!')

    res.redirect(`/index/${updateone._id}`)
}





module.exports.deletetemple = async function (req, res) {

    let { id } = req.params;
    let deleteOne = await temple.findByIdAndDelete(id);
    req.flash('success', 'SuccessFully Deleted A Temple!!')

    res.redirect('/index')
}