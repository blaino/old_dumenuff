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

    describe("addPlayer", function () {
        it("should put timestamped player in the Waiting collection", function () {
            var player = Meteor.users.findOne({username: "unitUser"});
            var beforeCount = Waiting.find().count();
            Meteor.call('addPlayer', player._id);
            var afterCount = Waiting.find().count();
            expect(afterCount).toEqual(beforeCount + 1);

            var waitingPlayer = Waiting.findOne({player: player._id});
            expect(waitingPlayer.timeEntered).toEqual(jasmine.any(Number));
            Waiting.remove({player: player._id});
        });
    });

    describe("match", function () {
        beforeEach(function () {
            var player;
            for (i = 1; i < 7; i++) {
                Accounts.createUser({
                    username: "unitUser" + String(i),
                    email: "unitUser" + String(i) + "@example.com",
                    password: "password"
                });
                player = Meteor.users.findOne({username: "unitUser" + String(i)});
                Meteor.call('addPlayer', player._id);
            };
        });

        afterEach(function () {
            var player;
            for (i = 1; i < 7; i++) {
                player = Meteor.users.findOne({username: "unitUser" + String(i)});
                Waiting.remove({player: player._id});
                Meteor.users.remove({username: "unitUser" + String(i)});
            };
            Rooms.remove({});
        });

        it("should put the oldest in a room with one of the other players", function () {
            var beforeCount = Rooms.find().count();
            Meteor.call('match');
            var afterCount = Rooms.find().count();
            expect(afterCount).toEqual(beforeCount + 1);

            room = Rooms.findOne({});
            expect(room.player1).not.toEqual(room.player2);

            // expect players in room to be user ids
            var account1 = Meteor.users.findOne({_id: room.player1});
            var account2 = Meteor.users.findOne({_id: room.player2});
            expect(account1).not.toEqual(null);
            expect(account2).not.toEqual(null);

            // expect one player in room to be the oldest
        });

    });

});
