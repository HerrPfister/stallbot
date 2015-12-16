'use strict';

function createStallResponse(stallOccupied) {
    return JSON.stringify({
        "statuses": {
            "51": {
                "Men": {
                    "spaces": {
                        "stall 1": {
                            "active": true,
                            "occupied": stallOccupied
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
