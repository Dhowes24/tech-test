 var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');

    AWS.config.region = process.env.REGION

    var app = express();

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));


    var apiKey = "c891518983807e7a46197e4de31eb2b9";
    var Request = require("request");
    var zipcodes = require('zipcodes');
    var geoip = require('geoip-lite');
    var requestIp = require('request-ip');

    app.locals.firstLoad = true;

    app.locals.city = "n/a";
    app.locals.state = "n/a";
    app.locals.weatherSummary = "n/a";
    app.locals.temp = "n/a";
    app.locals.time = "n/a";
    app.locals.icon = "n/a";


    app.get('/', async function(req, res) {
            try {

                var ip=requestIp.getClientIp(req);

                // var ip = "73.126.77.1";

                var geo = geoip.lookup(ip);

                console.log(ip);

                app.locals.city = geo.city;
                app.locals.state = geo.region;

                await Request.get('https://api.darksky.net/forecast/' + apiKey + '/' + geo.ll[0] + ',' + geo.ll[1], (error, response, body) => {
                    if (error) {

                        app.locals.city = "n/a";

                        return console.dir(error);
                    } else {
                        var json = JSON.parse(body);

                        app.locals.weatherSummary = json.currently.summary;
                        app.locals.temp = json.currently.temperature;
                        app.locals.time = json.currently.time;
                        app.locals.icon = json.currently.icon;

                    }

                    app.locals.firstLoad = false;


                    res.render('index');
                });
            } catch (e) {
                app.locals.city = "n/a";
                app.locals.firstLoad = false;

                res.render('index');

            }
    });

    app.post('/APIcall', async function (req, res) {

            var zipCode = req.body.ZipCode;

            try {

                var location = zipcodes.lookup(zipCode);

                var lat = location.latitude;
                var long = location.longitude;

                app.locals.city = location.city;
                app.locals.state = location.state;

                await Request.get('https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + long, (error, response, body) => {
                    if (error) {

                        app.locals.city = "n/a";

                        return console.dir(error);
                    }
                    else {
                        var json = JSON.parse(body);

                        app.locals.weatherSummary = json.currently.summary;
                        app.locals.temp = json.currently.temperature;
                        app.locals.time = json.currently.time;
                        app.locals.icon = json.currently.icon;

                    }
                    res.render('index');
                });
            } catch (e) {
                app.locals.city = "n/a";

                res.render('index');
            }
    });

    app.use(express.static(__dirname + '/'));

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
