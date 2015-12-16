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
            }
          }
        }
      }
    }
  });
}

module.exports = {
  occupied: createStallResponse(true, true),
  free: createStallResponse(false, false)
};
