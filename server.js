// server.js
// load the things we need
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var apiKey = "c891518983807e7a46197e4de31eb2b9";
var Request = require("request");
var zipcodes = require('zipcodes');


// set the view engine to ejs
app.set('view engine', 'ejs');

app.locals.city = "n/a";
app.locals.state = "n/a";
app.locals.weatherSummary = "n/a";
app.locals.temp = "n/a";
app.locals.time = "n/a";

app.locals.icon="n/a";

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});


app.post('/APIcall', async function (req, res) {
    var zipCode = req.body.ZipCode;

    try {

        var location = zipcodes.lookup(zipCode);
        // console.log(location);

        var lat = location.latitude;
        var long = location.longitude;

        app.locals.city = location.city;
        app.locals.state = location.state;

        await Request.get('https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + long, (error, response, body) => {
            if (error) {

                app.locals.city = "n/a";
                app.locals.state = "n/a";
                app.locals.weatherSummary = "n/a";
                app.locals.temp = "n/a";
                app.locals.time = "n/a";
                return console.dir(error);
            } else {
                var json = JSON.parse(body);

                app.locals.weatherSummary = json.currently.summary;
                app.locals.temp = json.currently.temperature;
                app.locals.time = json.currently.time;
                app.locals.icon = json.currently.icon;

                console.dir(json.currently.summary);
            }

            res.redirect("/");
        });
    }
    catch (e) {
        app.locals.city = "n/a";
        app.locals.state = "n/a";
        app.locals.weatherSummary = "n/a";
        app.locals.temp = "n/a";
        app.locals.time = "n/a";

        res.redirect("/");

    }

});

app.use(express.static(__dirname + '/'));


app.listen(8080);
