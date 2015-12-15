// Description:
//   A simple bot that will notify if any stalls in the bathrooms are occupied.
//
// Commands:
//   hubot stalls - Returns the status of all the stalls on each floor.
//
// Author:
//   Occupy Stall Street

var _       = require('lodash'),
    request = require('request');

function isStallOccupied(stall) {
    return stall.occupied ? 'Occupied' : 'Free';
}

function getStallStatuses(floorNumber) {
    var mensRoom      = stalls[floorNumber].Men.spaces,
        stallStatuses = [];

    _.keys(mensRoom, function (stall) {
        console.log('stall: ', stall);
        var occupancy = isStallOccupied(mensRoom[stall]);
        console.log('occupancy: ', occupancy);
        stallStatuses.push(stall + ': ' + occupancy);
    });

    return stallStatuses.join('\n');
}

function getStatusesByFloor(stalls) {
    var floorStatus = [],
        floors      = stalls.statuses;

    console.log('stalls: ', JSON.stringify(floors));

    _.keys(floors, function (floor) {
        console.log('floor: ', floor);
        var statusMessage = getStallStatuses(floor);
        console.log('statusMessage: ', statusMessage);
        floorStatus.push(floor + '\n' + statusMessage);
    });

    return floorStatus.join('\n');
}

module.exports = function (robot) {
    robot.respond(/stalls/i, function (robo) {
        robo.send('Checking stalls ...');

        request.get('http://slalomstalls.herokuapp.com/stalls', function (err, res, stalls) {
            var statuses;

            if (err) {
                console.log(JSON.stringify(error));

                robo.send('Holy cat\'s pajamas! Something went wrong. Try again later.');
            } else {
                robo.send('success! ' + JSON.stringify(stalls));

                statuses = getStatusesByFloor(stalls);

                robo.send(statuses);
            }
        });
    });
};
