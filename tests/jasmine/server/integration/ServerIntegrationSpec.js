// TODO: get rid of this

describe('Collections', function () {

    // Valid in prime time, but not with a bunch of seeder data:
    // describe('Channels', function () {
    //     it("on startup there should not be any", function () {
    //         expect(Channels.find().count()).toEqual(0);
    //     });
    // });

    describe('Messages', function () {
        it("on startup there should not be any", function () {
            expect(Messages.find().count()).toEqual(0);
        });
    });


});
