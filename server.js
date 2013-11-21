var http = require('http');
var express = require('express');
var mongodb = require('mongodb');
var monk = require('monk');
var vehicle = require('./routes/vehicle.js');
var path = require('path');

// setup database
var db = monk('localhost:28017/CarPoolCalc');

// setup express
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// setup routes
app.use('/vehicle', vehicle.handle);

// default route
app.use('/', function(req, res) {res.end('CPC Application - Alpha 0.0.1')});

// start listening
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var TestTrip = function() {
   // Create the Vehicles
    var rVehicle = new cpc.Vehicle("Land Rover Discovery", 14.5, .10, "Ryan");
    var sVehicle = new cpc.Vehicle("Ford F150", 15, .10, "Sean");

    console.log(rVehicle.name);
    console.log(sVehicle.name);

    // Start a trip
    var trip1 = new cpc.Trip(Date.now(), rVehicle);                          // Create & Start the trip
    trip1.start();
    trip1.addLeg(new cpc.TripLeg(trip1, 1.1));                              // Create the 1st leg of the trip (Ryan's house --> Scott's house)    -- 1.1 miles
    rVehicle.addPassenger(new cpc.Passenger("Scott"));                      // Add 'Scott' as a passenger
    trip1.addLeg(new cpc.TripLeg(trip1, 15));                               // Create the 2nd leg of the trip (Scott's house --> Park & Ride)     -- 15 miles
    rVehicle.addPassenger(new cpc.Passenger("Sean"));                       // Add 'Sean' as a passenger
    trip1.addLeg(new cpc.TripLeg(trip1, 17));                               // Create the 3rd leg of the trip (Park & Ride --> First Solar)       -- 17 miles
    trip1.stop();

    var legs = trip1.getLegs();
    console.log("Total Miles = " + trip1.getTotalMiles());
    console.log('');

    // test repository remove
    var tripLegRepo = new repo.TripLegRepository();
    _.each(legs, function(leg) {
        tripLegRepo.addTripLeg(leg);
    });
    tripLegRepo.removeTripLeg(trip1.legs[1]);
    //

    var output = '';
    for (var i = 0; i < legs.length; i++) {
        output += 'Leg ' + i.toString() + ': TotalCost = ' + legs[i].totalCostPerMile() + ', TotalCostPerPerson = ' + legs[i].totalCostPerPerson() + '\n';
    }

    return output;
}