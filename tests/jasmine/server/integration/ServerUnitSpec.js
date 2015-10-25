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

        var unitUserLoser = Meteor.users.findOne({username: "unitUserLoser"});
        if (!unitUserLoser) {
            Accounts.createUser({
                username: "unitUserLoser",
                email: "unitUserLoser@example.com",
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

        var winner = Meteor.users.findOne({username: "unitUser"});
        var loser = Meteor.users.findOne({username: "unitUserLoser"});

        it("should add score to Scores if one for the winning player does not yet exist",
           function () {
               Accounts.createUser({
                   username: "thisUnitUser",
                   email: "thisUnitUser@example.com",
                   password: "password"
               });
               var beforeCount = Scores.find().count();
               var player = Meteor.users.findOne({username: "thisUnitUser"});
               Meteor.call('updateScore', player._id);
               var afterCount = Scores.find().count();
               expect(afterCount).toEqual(beforeCount + 1);
               Meteor.users.remove({username: "thisUnitUser"});
           });

        it("should set score to one for first time update", function () {
            Meteor.call('updateScore', winner._id);
            var afterScore = Scores.findOne({player: winner._id});
            expect(afterScore.score).toEqual(1);
        });

        it("should increment score for subsequent updates", function () {
            // depends on previous test
            var beforeScore = Scores.findOne({player: winner._id}).score;
            Meteor.call('updateScore', winner._id);
            var afterScore = Scores.findOne({player: winner._id}).score;
            expect(afterScore).toEqual(beforeScore + 1);
        });

        it("should add score to Scores if one for the loser does not yet exist",
           function () {
               Accounts.createUser({
                   username: "thisUnitUserWinner",
                   email: "thisUnitUserWinner@example.com",
                   password: "password"
               });
               Accounts.createUser({
                   username: "thisUnitUserLoser",
                   email: "thisUnitUserLoser@example.com",
                   password: "password"
               });
               var winner = Meteor.users.findOne({username: "thisUnitUserWinner"});
               var loser = Meteor.users.findOne({username: "thisUnitUserLoser"});

               var beforeCount = Scores.find().count();
               Meteor.call('updateScore', winner._id, loser._id);
               var afterCount = Scores.find().count();
               expect(afterCount).toEqual(beforeCount + 2);
               Meteor.users.remove({username: "thisUnitUserLoser"});
               Meteor.users.remove({username: "thisUnitUserWinner"});
           });

        it("should set loser score to -1 for first time update", function () {
            Meteor.call('updateScore', winner._id, loser._id);
            var afterScore = Scores.findOne({player: loser._id});
            expect(afterScore.score).toEqual(-1);
        });

        it("should decrement score for loser", function () {
            // depends on previous test
            var beforeScore = Scores.findOne({player: loser._id}).score;
            Meteor.call('updateScore', winner._id, loser._id);
            var afterScore = Scores.findOne({player: loser._id}).score;
            expect(afterScore).toEqual(beforeScore - 1);
        });
    });

    describe("getWinner", function () {

        var room,
            unitUserId;

        beforeEach(function () {
            setupPlayersInWaiting(2);
            unitUserId = Meteor.users.findOne({username: "unitUser1"})._id;
            Meteor.call('match', 0);
            room = Meteor.call('findRoom', unitUserId);
        });

        afterEach(function () {
            tearDownPlayersAndRooms(2);
        });

        it("returns player that correctly selects bot", function () {
            room.player2 = "bot"; // Having to overwrite is lame
            var selectee = room.player2;
            var selection = "bot";
            var winner = Meteor.call('getWinner', room, selectee, selection);
            expect(winner).toEqual(room.player1);
        });

        it("returns id of player that correctly selects human", function () {
            var selectee = room.player2;
            var selection = "human";
            var winner = Meteor.call('getWinner', room, selectee, selection);
            expect(winner).toEqual(room.player1);
        });

        it("returns player that fooled human", function () {
            var selectee = room.player2;
            var selection = "bot";
            var winner = Meteor.call('getWinner', room, selectee, selection);
            expect(winner).toEqual(room.player2);
        });

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

    function setupPlayersInWaiting(numPlayers) {
        var player;

        Rooms.remove({});
        for (i = 1; i <= numPlayers; i++) {
            if (!Meteor.users.findOne({username: "unitUser" + String(i)})) {
                Accounts.createUser({
                    username: "unitUser" + String(i),
                    email: "unitUser" + String(i) + "@example.com",
                    password: "password"
                });
            };
            player = Meteor.users.findOne({username: "unitUser" + String(i)});
            Meteor.call('addPlayer', player._id);
        };
    };

    function tearDownPlayersAndRooms(numPlayers) {
        var player;
        for (i = 1; i <= numPlayers; i++) {
            player = Meteor.users.findOne({username: "unitUser" + String(i)});
            Waiting.remove({player: player._id});
            Meteor.users.remove({username: "unitUser" + String(i)});
        };
        Rooms.remove({});
    };

    describe("match", function () {
        beforeEach(function () {
            setupPlayersInWaiting(7);
        });

        afterEach(function () {
            tearDownPlayersAndRooms(7);
        });

        xit("should handle when there is only 1 player", function () {
            // Or should it? When would you start with less than 2 players?
            expect(true).toEqual(false);
        });

        it("should put the oldest in a room with one of the other players", function () {
            var beforeCount = Rooms.find().count();
            Meteor.call('match', 0);
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

        it("should be able to be called multiple time to setup rooms", function () {
            var beforeCount = Rooms.find().count();
            var beforeWaitingCount = Waiting.find().count();

            Meteor.call('match', 0);
            Meteor.call('match', 0);
            Meteor.call('match', 0);

            var afterCount = Rooms.find().count();
            var afterWaitingCount = Waiting.find().count();
            expect(afterCount).toEqual(beforeCount + 3);
            expect(afterWaitingCount).toEqual(beforeWaitingCount - 6);
        });
    });

    describe("findRoom", function () {
        beforeEach(function () {
            setupPlayersInWaiting(7);
            Meteor.call('match', 0);
        });

        afterEach(function () {
            tearDownPlayersAndRooms(7);
        });


        it("should return a room with unitUser1 as player1", function () {
            var user = Meteor.users.findOne({username: "unitUser1"});
            var userid = user._id;

            Meteor.call('findRoom', userid, function (error, room) {
                expect(error).not.toBeDefined();
                expect(room.player1).toEqual(userid);
            });
        });

        it("should return an error when trying to find room for non-existant userid", function () {
            var bsId = 'bs1234';

            Meteor.call('findRoom', bsId, function (error, room) {
                expect(error).toBeDefined();
            });
        });

    });

});
