'use strict';

var stallbot = require('../scripts/main'),

    statusResponseGenerator = require('../examples/statuses.js'),

    fluki = require('fluki'),
    request = require('request'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

describe('stallbot', function () {
    var sandbox,

        response,
        bot;

    before(function () {
       chai.use(sinonChai);
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        bot = {
            send: sandbox.stub()
        };

        response = {
            respond: sandbox.stub().yields(bot)
        };
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('when both stalls are occupied', function () {
        beforeEach(function () {
            sandbox.stub(request, 'get').yields(undefined, {status: '200'}, statusResponseGenerator.occupied);

            stallbot(response)
        });

        it('should generate the correct response message', function () {
            expect(bot.send).to.have.callCount(2);

            expect(bot.send).to.have.been.calledWith('Checking stalls...');
            expect(bot.send).to.have.been.calledWith('51\nstall 1: (maga)');
        });
    });

    describe('when both stalls are free', function () {
        beforeEach(function () {
            sandbox.stub(request, 'get').yields(undefined, {status: '200'}, statusResponseGenerator.free);

            stallbot(response)
        });

        it('should generate the correct response message', function () {
            expect(bot.send).to.have.callCount(2);

            expect(bot.send).to.have.been.calledWith('Checking stalls...');
            expect(bot.send).to.have.been.calledWith('51\nstall 1: (greencheck)');
        });
    });

    describe('when an error occurs', function () {
        var randomString, error;

        beforeEach(function () {
            randomString = fluki.string();
            error = {
                message: randomString
            };

            sandbox.spy(console, 'log');
            sandbox.stub(request, 'get').yields(error, {status: '500'}, undefined);

            stallbot(response)
        });

        it('should log the correct error message', function () {
            expect(console.log).to.have.callCount(1);
            expect(console.log).to.have.been.calledWith(randomString);
        });

        it('should generate the correct response message', function () {
            expect(bot.send).to.have.callCount(2);
            expect(bot.send).to.have.been.calledWith('Checking stalls...');
            expect(bot.send).to.have.been.calledWith('Holy cat\'s pajamas! Something went wrong. Try again later.');
        });
    });
});
