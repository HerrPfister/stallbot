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
    return stall.occupied ? '(maga)' : '(greencheck)';
}

function getStallStatuses(floor) {
    var mensRoomStalls = floor.Men.spaces,
        stallNames     = _.keys(mensRoomStalls),
        stallStatuses  = [];

    _.forEach(stallNames, function (stallName) {
        var occupancy = isStallOccupied(mensRoomStalls[stallName]);

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

module.exports = function (stallbot) {
    stallbot.respond(/stalls/i, function (bot) {
        bot.send('Checking stalls...');

        request.get('http://slalomstalls.herokuapp.com/stalls', function (err, res, stalls) {
            var statuses;

            if (err) {
                console.log(err.message);

                bot.send('Holy cat\'s pajamas! Something went wrong. Try again later.');
            } else {
                statuses = getStatusesByFloor(JSON.parse(stalls));

                bot.send(statuses)
            }
        });
    });
};
