describe('Getting started with Jasmine and Meteor', function () {
    'use strict';

    it("a user's score should be a number displayed in the ui", function () {
        var score = Number($('.user-menu_score').text());
        expect(score).toEqual(jasmine.any(Number));
    });

    it("winning a round should increase user's score by 1 point", function () {
    });

    it("losing a round should increase opponent's score by 1 point", function () {
    });

    it("clicking bot when playing a bot is a win", function () {
    });

    it("clicking bot when playing a human is a loss", function () {
    });

    it("clicking human when playing a human is a win", function () {
    });

    it("clicking human when playing a bot is a loss", function () {
    });

    it("both buttons should be inactive before the game has started", function () {
    });

    describe('game', function () {
        it("should end when time limit is reached", function () {
        });
        it("should display winner when time limit is reached", function () {
        });
        it("should start when start timer expires", function () {
        });
        describe('start timer', function () {
            it("should start when all x players have joined", function () {
            });
        });
    });

});
