var vehicleRepository = require('./../repository/vehicle.js');

exports.handle = function(req, res) {
    switch(req.path) {
        case '/add':
            return add(req, res);
            break;
        casedefault:
            res.end('Vehicle - method not supported');
            break;
    }
};

var add = function(req, res) {
    switch(req.method) {
        case 'GET':
            res.render('vehicle.jade', { 'Vehicles': vehicleRepository.getAll() });
            break;
    }
};