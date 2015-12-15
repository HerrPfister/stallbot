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

function getStallStatuses(floor) {
    var mensRoom        = floor.Men.spaces,
        stalls        = _.keys(mensRoom),
        stallStatuses = [];

    _.forEach(stalls, function (stallName) {
        var occupancy = isStallOccupied(mensRoom[stallName]);

        stallStatuses.push(stallName + ': ' + occupancy);
    });

    return stallStatuses.join('\n');
}

function getStatusesByFloor(stalls) {
    var floors       = stalls.statuses,
        floorNumbers = _.keys(floors),
        floorStatus  = [];

    _.forEach(floorNumbers, function (floorNumber) {
        var statusMessage = getStallStatuses(floors[floorNumber]);

        floorStatus.push(floorNumber + '\n' + statusMessage);
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
                statuses = getStatusesByFloor(JSON.parse(stalls));

                robo.send(statuses)
            }
        });
    });
};
