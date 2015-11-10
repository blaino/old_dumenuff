describe('Getting started with Jasmine and Meteor', function () {
    'use strict';

    it("a user's score should be a number displayed in the ui", function () {
        var score = Number($('.user-menu_score').text());
        expect(score).toEqual(jasmine.any(Number));
    });
});



// These tests put game into end state skirting seeder's newGame()
// Once the stuff in seeder is user-controled input, these tests could
// be turned back on.

// describe('listings.events', function () {

//     describe('click #bot-button', function () {

//         it("should change channel to lobby", function () {
//             Meteor.call('startGame');

//             $('#bot-button').click();
//             expect(Session.get('channel')).toEqual('lobby');

//             Meteor.call('endGame');
//         });

//     });

//     describe('click #human-button', function () {

//         it("should change channel to lobby", function () {
//             Meteor.call('startGame');

//             $('#human-button').click();
//             expect(Session.get('channel')).toEqual('lobby');

//             Meteor.call('endGame');
//         });

//     });


});
