// Description:
//   A simple bot that will notify if any stalls in the bathrooms are occupied.
//
// Commands:
//   hubot <stalls> - Returns the status of all the stalls on each floor.
//
// Author:
//   Occupy Stall Street

var _ = require('lodash'),
    request = require('request'),

    useMocks = _.includes(process.argv, function (arg) {
        return arg.indexOf('mocks') || arg === '-m';
    }),

    URL = useMocks ? 'http://localhost:5000/stalls' : 'http://slalomstalls.herokuapp.com/stalls';

function isStallOccupied(stall) {
    return stall.occupied ? 'Occupied' : 'Free';
}

function getStallStatuses(floorNumber) {
    var mensRoom      = stalls[floorNumber].Men.spaces,
        stallStatuses = [];

    _.keys(mensRoom, function (stall) {
        var stallOccupied = isStallOccupied(mensRoom[stall]);

        stallStatuses.push(stall + ': ' + stallOccupied);
    });

    return stallStatuses;
}

function getStatusesByFloor(stalls) {
    var floorStatus = [],
        floors = stalls.statuses;

    _.keys(floors, function (floor) {
        var statusMessage = getStallStatuses(floor);

        floorStatus.push(floor + '\n' + statusMessage);
    });

    return floorStatus.join('\n\n');
}

module.exports = function (robot) {
    robot.respond(/stalls/i, function (res) {
        request.get(URL)
            .on('response', function (stalls) {
                var statuses = getStatusesByFloor(JSON.parse(stalls));

                res.send(statuses);
            })
            .on('error', function (error) {
                res.send('Yo brah, something went wrong. Try again later.');
            });
        }
    );
};
