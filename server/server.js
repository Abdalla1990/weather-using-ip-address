var { Mongoose } = require('./db/connection.js');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var { address } = require('./modules/address');
var darksky = require('./../server/api/darksky');
let {getIPAddress} = require('./api/ipAddress');
var Address;
let IpAddress;
const requestIp = require('request-ip');
const port = process.env.PORT || 3000;

var app = express();
app.set('view engin', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/displayAddress', (req, res) => {

    //console.log(req.body);
    Address = req.body.address;
    // heroku Usage 
    IpAddress = requestIp.getClientIp(req); 
    // In case you are running the app on ypur localhost 
    let localIp = '173.177.140.42';

    
    console.log('server : ', localIp);



    getIPAddress(IpAddress).then((body) => {
       
        if (!body) return console.log('unable to find response!');
        if (body === 'there is an error Unable to find that address.') { throw new Error('Unable to find that address.') };


         var formatted_address = body.data.city + body.data.country ;
         var latitude = body.data.lat;
         var lngtitude = body.data.lon;
        
        darksky.getTemperature(latitude, lngtitude).then((temp) => {
            var ad = new address({
                address: formatted_address,
                lat: latitude,
                lng: lngtitude,
                IPAddress: IpAddress ,
                temp: temp.data.currently.temperature
            });
            ad.save().then((doc) => {
                res.render('address.hbs', {
                    address: formatted_address,
                    lat: latitude,
                    lng: lngtitude,
                    IPAddress: IpAddress ,
                    temp: temp.data.currently.temperature
                }).status(200).send(doc);

            }, (err) => {
                res.status(400).send(err);
            });
        }), (err) => { res.send(err); };



    }).catch((error) => {
        if (error.code === 'ENOTFOUND')
            res.send(`unable to coonect to API ${error.code}`);
        else
            res.send(`there is an error ${error.message}`);
    })

});


app.get('/', (req, res) => {

    res.render('home.hbs', {});

});

app.listen(port, () => {
    console.log(`started at ${port} .`)
});






module.exports = { Address }