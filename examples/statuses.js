'use strict';

function createStallResponse(isStallOccupied) {
    return JSON.stringify({
        "statuses": {
            "51": {
                "Men": {
                    "spaces": {
                        "stall 1": {
                            "active": true,
                            "occupied": isStallOccupied
                        }
                    }
                }
            }
        }
    });
}

module.exports = {
    occupied: createStallResponse(true),
    free: createStallResponse(false)
};
