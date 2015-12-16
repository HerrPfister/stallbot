'use strict';

var stallbot = require('../../../scripts/main'),

    statusResponseGenerator = require('../../../examples/statuses.js'),

    request = require('request'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

describe('stallbot', function () {
    var sandbox;

    before(function () {
       chai.use(sinonChai);
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('when statuses are successfully returned', function () {
        var response,
            bot;

        beforeEach(function () {
            response = {
                respond: sandbox.spy()
            };

            bot = {
                send: sandbox.spy()
            };
        });

        describe('when both stalls are occupied', function () {
            var data,
                expectedMessage;

            beforeEach(function () {
                data = statusResponseGenerator.allOccupied;
                expectedMessage = '51\nStall 1: Occupied\nStall 2: Occupied';

                sandbox.stub(request, 'get').yields(undefined, {status: '200'}, data);

                stallbot(response)
            });

            it('should', function () {
                expect(bot.send).to.have.callCount(1);
                expect(bot.send).to.have.been.calledWith(expectedMessage);
            });
        });
    });
});
