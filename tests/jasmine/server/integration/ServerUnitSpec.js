describe('methods', function () {

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
        // Commenting to save time:
        // it("should return a string", function () {
        //     var replyFromBot = Meteor.call('reply', "Hello there");
        //     expect(typeof replyFromBot).toEqual('string');
        // });

        it("response time should vary", function () {
            var firstReplyTime, secondReplyTime;
            var timeBefore = new Date().getTime();
            var replyFromBot = Meteor.call('reply', "Hi");
            var timeAfter = new Date().getTime();
            firstReplyTime = timeAfter - timeBefore;

            timeBefore = new Date().getTime();
            replyFromBot = Meteor.call('reply', "Hi");
            timeAfter = new Date().getTime();
            secondReplyTime = timeAfter - timeBefore;

            var delta = Math.abs(secondReplyTime - firstReplyTime);
            expect(delta).not.toBeCloseTo(0);
        });
    });

    describe("updateScore", function () {

        var winner = Meteor.users.findOne({username: "unitUser"});
        var loser = Meteor.users.findOne({username: "unitUserLoser"});

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

        it("should add score to Scores if they don't yet exist",
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
            var winner = Meteor.call('getWinner', room, selectee, selection)[0];
            expect(winner).toEqual(room.player1);
        });

        it("returns id of player that correctly selects human", function () {
            var selectee = room.player2;
            var selection = "human";
            var winner = Meteor.call('getWinner', room, selectee, selection)[0];
            expect(winner).toEqual(room.player1);
        });

        it("returns player that fooled human", function () {
            var selectee = room.player2;
            var selection = "bot";
            var winner = Meteor.call('getWinner', room, selectee, selection)[0];
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

        Waiting.remove({});
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

        describe("with just one player", function () {

            beforeEach(function () {
                setupPlayersInWaiting(1);
            });

            afterEach(function () {
                tearDownPlayersAndRooms(1);
            });

            it("should match with bot even if botPercent is 0", function () {
                var unitUserId = Meteor.users.findOne({username: "unitUser1"})._id;
                Meteor.call('match', 0);
                var room = Meteor.call('findRoom', unitUserId);
                expect(room.player2).toEqual("bot");
            });

        });

        describe("with more than one player", function () {

            beforeEach(function () {
                setupPlayersInWaiting(7);
            });

            afterEach(function () {
                tearDownPlayersAndRooms(7);
            });

            it("should put the oldest in a room with one of the other players (0% bot)",
               function () {
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

                   expect(account1).not.toEqual("bot");
                   expect(account2).not.toEqual("bot");

                   // expect one player in room to be the oldest
               });

            it("should put the oldest in a room with a bot (100% bot)", function () {
                var unitUserId = Meteor.users.findOne({username: "unitUser1"})._id;
                Meteor.call('match', 100);
                var room = Meteor.call('findRoom', unitUserId);
                expect(room.player2).toEqual("bot");
            });

            it("should be able to be called multiple time to setup rooms (0% bot)",
               function () {
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

    describe("getOtherPlayer", function () {
        beforeEach(function () {
            setupPlayersInWaiting(2);
            Meteor.call('match', 0);
        });

        afterEach(function () {
            tearDownPlayersAndRooms(2);
        });

        it("should return a different player in the same room", function () {
            var user = Meteor.users.findOne({username: "unitUser1"});
            var userid = user._id;
            var room = Meteor.call('findRoom', userid);

            var otherPlayerId = Meteor.call('getOtherPlayer', userid, room);
            var otherPlayerRoom = Meteor.call('findRoom', otherPlayerId);

            expect(otherPlayerId).not.toEqual(userid);
            expect(room).toEqual(otherPlayerRoom);
        });
    });

    describe("scoreAndRematch", function () {

        describe("should always", function () {

            it("remove 1 room, 1 channel", function () {
                setupPlayersInWaiting(4);
                Meteor.call('matchPlayers', 0, 1, 3000);
                var waiting = Waiting.find({}).fetch().length;
                expect(waiting).toEqual(0);

                var aRoom = Rooms.findOne({});
                var player = aRoom.player1;

                spyOn(Rooms, 'remove');
                spyOn(Channels, 'remove');
                Meteor.call('scoreAndRematch', player, "bot", aRoom);
                expect(Rooms.remove.calls.count()).toEqual(1);
                expect(Channels.remove.calls.count()).toEqual(1);

                tearDownPlayersAndRooms(4);
            });

        });

        describe("with two humans", function () {

            beforeEach(function () {
                setupPlayersInWaiting(2);
                Meteor.call('match', 0);
            });

            afterEach(function () {
                tearDownPlayersAndRooms(2);
            });

            it("fooled should lose a point, fooler should gain a point", function () {
                var playerId = Meteor.users.findOne({username: "unitUser1"})._id;
                var room = Meteor.call('findRoom', playerId);
                var otherPlayerId = Meteor.call('getOtherPlayer', playerId, room);

                Meteor.call('scoreAndRematch', playerId, "bot", room);

                var afterScorePlayer1 = Scores.findOne({player: playerId}).score;
                var afterScorePlayer2 = Scores.findOne({player: otherPlayerId}).score;

                expect(afterScorePlayer1).toEqual(-1);
                expect(afterScorePlayer2).toEqual(1);
            });
        });

        describe("with a bot", function () {

            beforeEach(function () {
                setupPlayersInWaiting(1);
                Meteor.call('match', 100);
            });

            afterEach(function () {
                tearDownPlayersAndRooms(1);
            });

            it("player's score should go up by one after selecting bot", function () {
                var playerId = Meteor.users.findOne({username: "unitUser1"})._id;
                var room = Meteor.call('findRoom', playerId);

                Meteor.call('scoreAndRematch', playerId, "bot", room);

                var afterScorePlayer1 = Scores.findOne({player: playerId}).score;

                expect(afterScorePlayer1).toEqual(1);
            });

            it("player's score should go down by one after selecting human", function () {
                var playerId = Meteor.users.findOne({username: "unitUser1"})._id;
                var room = Meteor.call('findRoom', playerId);

                Meteor.call('scoreAndRematch', playerId, "human", room);

                var afterScorePlayer1 = Scores.findOne({player: playerId}).score;

                expect(afterScorePlayer1).toEqual(-1);
            });

        });
    });

    describe("countLogins", function () {
        beforeEach(function () {
            setupPlayersInWaiting(3);
        });

        afterEach(function () {
            tearDownPlayersAndRooms(3);
        });

        it("should return 0 before anyone has logged on", function () {
            var count = Meteor.call('countLogins');
            expect(count).toEqual(0);
        });

        // This won't work on the server:
        // it("should return 1 after a single user logs on", function () {
        //     Meteor.loginWithPassword('unitUser1', 'password');
        //     var count = Meteor.call('countLogins');
        //     expect(count).toEqual(1);
        // });
    });

    describe("newGame", function () {
        it("should add one element to Game collection", function () {
            Meteor.call('newGame', 10, 100, 2, 50);
            var countAfter = Game.find({}).count();
            expect(countAfter).toEqual(1);
        });
    });

    describe("readyGame", function () {
        it("should change state to Readying", function () {
            Meteor.call('readyGame');
            var state = Game.findOne({}).state;
            expect(state).toEqual("Readying");
        });
    });

    describe("startGame", function () {
        it("should change state to Started", function () {
            Meteor.call('startGame');
            var state = Game.findOne({}).state;
            expect(state).toEqual("Started");
        });
    });

    describe("endGame", function () {
        it("should change state to Ended", function () {
            Meteor.call('endGame');
            var state = Game.findOne({}).state;
            expect(state).toEqual("Ended");
        });
    });

    describe("matchPlayers", function () {
        it("should match every player when threshold is 1", function () {
            setupPlayersInWaiting(5);
            Meteor.call('matchPlayers', 0, 1, 3000);
            var waiting = Waiting.find({}).fetch().length;
            expect(waiting).toEqual(0);
            tearDownPlayersAndRooms(5);
        });

        // For complex version of matchPlayers() - maybe a bs test
        // it("should call match 3x when threshold is 3 and 5 players", function () {
        //     setupPlayersInWaiting(5);
        //     spyOn(Meteor, 'call').and.callThrough();
        //     Meteor.call('matchPlayers', 0, 3, 10);
        //     expect(Meteor.call).toHaveBeenCalledWith('match', 0);
        //     // One for the original call to matchPlayers, 3 calls to match
        //     expect(Meteor.call.calls.count()).toEqual(4);
        //     tearDownPlayersAndRooms(5);
        // });

        it("should call match 2x when threshold is 1 and 2 players", function () {
            setupPlayersInWaiting(2);
            spyOn(Meteor, 'call').and.callThrough();
            Meteor.call('matchPlayers', 0, 1, 10);
            expect(Meteor.call).toHaveBeenCalledWith('match', 0);

            // This expectation sucks - gotta be a better way
            expect(Meteor.call.calls.count()).toEqual(2);
            tearDownPlayersAndRooms(2);
        });
    });

    describe("rematch", function () {

        it("should call Waiting.insert twice if no bot", function () {
            setupPlayersInWaiting(4);
            Meteor.call('matchPlayers', 0, 1, 3000);
            var waiting = Waiting.find({}).fetch().length;
            expect(waiting).toEqual(0);

            var aRoom = Rooms.findOne({});
            var player = aRoom.player1;

            spyOn(Waiting, 'insert');
            Meteor.call('rematch', player, aRoom);
            expect(Waiting.insert.calls.count()).toEqual(2);

            tearDownPlayersAndRooms(4);
        });

        it("should call Waiting.insert once if bot in room", function () {
            setupPlayersInWaiting(4);
            Meteor.call('matchPlayers', 100, 1, 3000);
            var waiting = Waiting.find({}).fetch().length;
            expect(waiting).toEqual(0);

            var aRoom = Rooms.findOne({});
            var player = aRoom.player1;

            spyOn(Waiting, 'insert');
            Meteor.call('rematch', player, aRoom);
            expect(Waiting.insert.calls.count()).toEqual(1);

            tearDownPlayersAndRooms(4);
        });

        it("should call matchPlayers", function () {
            setupPlayersInWaiting(4);
            Meteor.call('matchPlayers', 0, 1, 3000);
            var waiting = Waiting.find({}).fetch().length;
            expect(waiting).toEqual(0);

            var aRoom = Rooms.findOne({});
            var player = aRoom.player1;

            spyOn(Meteor, 'call').and.callThrough();

            Meteor.call('rematch', player, aRoom);

            var game = Game.findOne({});
            var percentBot = game.percentBot;
            var threshold = game.threshold;
            var pauseTime = game.pauseTime;

            expect(Meteor.call).toHaveBeenCalledWith('matchPlayers', percentBot, threshold,
                                                     pauseTime);
        });

    });

});
