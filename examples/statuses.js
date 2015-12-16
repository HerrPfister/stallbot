'use strict';

function createStallResponse(stall1Occupied, stall2Occupied) {
  return JSON.stringify({
    "statuses": {
      "51": {
        "Men": {
          "spaces": {
            "stall 1": {
              "active": true,
              "occupied": stall1Occupied
            },
            "stall 2": {
              "active": true,
              "occupied": stall2Occupied
            }
          }
        }
      }
    }
  });
}

module.exports = {
  allOccupied: createStallResponse(true, true),
  stall1Occupied: createStallResponse(true, false),
  stall2Occupied: createStallResponse(false, true),
  allFree: createStallResponse(false, false)
};
