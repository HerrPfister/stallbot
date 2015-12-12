// Description:
//   A simple bot that will notify if any stalls in the bathrooms are occupied.
//
// Commands:
//   hubot <stalls> - Returns the status of all the stalls on each floor.
//
// Author:
//   Occupy Stall Street

var _ = require('lodash'),
    request = require('request');

function isStallOccupied (stall) {
    return stall.occupied ? 'Occupied' : 'Free';
}

function getStallStatuses (floorNumber) {
    var mensRoom      = stalls[floorNumber].Men.spaces,
        stallStatuses = [];

    _.keys(mensRoom, function (stall) {
        var stallOccupied = isStallOccupied(mensRoom[stall]);

        stallStatuses.push(stall + ': ' + stallOccupied);
    });

    return stallStatuses;
}

function getStatusesByFloor (stalls) {
    var floorStatus = [],
        floors = stalls.statuses;

    _.keys(floors, function (floor) {
        var statusMessage = getStallStatuses(floor);

        floorStatus.push(floor + '\n' + statusMessage);
    });

    return floorStatus.join('\n\n');
}

//'http://slalomstalls.herokuapp.com/stalls'

module.exports = function (robot) {
    robot.respond(/stalls/i, function (res) {

        res.send('Checking stalls ...');

        request.get('http://localhost:5000/stalls')
            .on('response', function (stalls) {
                var statuses = getStatusesByFloor(JSON.parse(stalls));

                res.send(statuses);
            })
            .on('error', function (error) {
                console.log(JSON.stringify(error));

                res.send('Yo brah, something went wrong. Try again later.');
            });
        }
    );
};
