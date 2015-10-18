describe('methods', function () {

   // beforeEach(function () {
        var unitUser = Meteor.users.findOne({username: "unitUser"});
        if (!unitUser) {
            Accounts.createUser({
                username: "unitUser",
                email: "unitUser@example.com",
                password: "password"
            });
        }
    //});

    // afterEach(function () {
    //    Meteor.users.remove({username: "unitUser"});
    //});

    describe('newMessage', function () {
        it("should add a message", function () {
            var beforeCount = Messages.find().count();
            Meteor.call('newMessage',
                        Meteor.users.findOne({username: "unitUser"}),
                        {text: "unit test test message",
                         channel: "general"});
            var afterCount = Messages.find().count();
            expect(afterCount).toEqual(beforeCount + 1);
        });
    });

    describe("reply", function () {
        it("should return a string", function () {
            var replyFromBot = Meteor.call('reply', "Hello there");
            expect(typeof replyFromBot).toEqual('string');
        });

        it("response time should vary", function () {
            var firstReplyTime, secondReplyTime;
            var timeBefore = new Date().getTime();
            var replyFromBot = Meteor.call('reply', "Hello there");
            var timeAfter = new Date().getTime();
            firstReplyTime = timeAfter - timeBefore;

            timeBefore = new Date().getTime();
            replyFromBot = Meteor.call('reply', "Hello there");
            timeAfter = new Date().getTime();
            secondReplyTime = timeAfter - timeBefore;

            var delta = Math.abs(secondReplyTime - firstReplyTime);
            expect(delta).not.toBeCloseTo(0);
        });
    });

    describe("updateScore", function () {
        it("should add score if one for the winning player does not yet exist",
           function () {
               Accounts.createUser({
                   username: "thisUnitUser",
                   email: "thisUnitUser@example.com",
                   password: "password"
               });
               var beforeCount = Scores.find().count();
               var player = Meteor.users.findOne({username: "thisUnitUser"});
               Meteor.call('updateScore',
                           player._id);
               var afterCount = Scores.find().count();
               expect(afterCount).toEqual(beforeCount + 1);
               Meteor.users.remove({username: "thisUnitUser"});
           });

        it("should increment score for already existing player", function () {
            var player = Meteor.users.findOne({username: "unitUser"});
            var beforeScore = Scores.findOne({player: player._id});
            Meteor.call('updateScore',
                        player._id);
            var afterScore = Scores.findOne({player: player._id});
            expect(afterScore.score).toEqual(beforeScore.score + 1);
        });

        xit("should add score if one for the loser does not yet exist");
    });

});
