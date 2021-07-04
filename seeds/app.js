//required the needee
const mongoose = require('mongoose');
//imported campground schema from models folder
const Campground = require('../models/campground');
const { Console } = require('console');
const { descriptors, places } = require('./seedhelpers');
//requring the cities json file
let cities = require('./cities');
//using the default port
mongoose.connect('mongodb://localhost:27017/campground', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(functions => {
        console.log('Mongo Connected Successfully!!!')
    }).catch(err => {
        console.log('Mongo Error :(')
        console.log(err)
    })

//array by its lenght
let randByLength = array => array[Math.floor(Math.random() * array.length)];
//display the cities file with city and state => with mixed descriptors and places
let seedhelpers = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        let randNumber = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 2000) + 1000;
        let newdata = new Campground({
            price,
            user: '60d1e178f1b6c218b8686bfb',
            location: `${cities[randNumber].city},${cities[randNumber].state}`,
            title: `${randByLength(descriptors)} ${randByLength(places)}`,
            special: 'Every Friday Gold Ratham for Lord!',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randNumber].longitude,
                    cities[randNumber].latitude,
                ]
            },
            description: "sample history!",
            mortimein: '9AM',
            mortimeout: '1PM',
            aftimein: '4PM',
            aftimeout: '8PM',
            contact: 9791879861,
            img: [
                {

                    url: 'https://res.cloudinary.com/kiranmurugu/image/upload/v1624865499/YelpCamp/mng7os8sfvhw1yg3pbgo.jpg',
                    filename: 'YelpCamp/mng7os8sfvhw1yg3pbgo'
                },
                {

                    url: 'https://res.cloudinary.com/kiranmurugu/image/upload/v1624865501/YelpCamp/qjmsvm4j4bqugq8tierc.jpg',
                    filename: 'YelpCamp/qjmsvm4j4bqugq8tierc'
                },
                {

                    url: 'https://res.cloudinary.com/kiranmurugu/image/upload/v1624865507/YelpCamp/qm6t1bujczvesv4aj9vm.jpg',
                    filename: 'YelpCamp/qm6t1bujczvesv4aj9vm'
                }
            ]



        });
        await newdata.save();
    }
}
//run the function
seedhelpers();
