describe('Collection: Channels', function () {
    it("on startup there should be general and random channels", function () {
        expect(Channels.find().count()).toBeGreaterThan(0);
        expect(Channels.find({name: "general"})).not.toBe(null);
        expect(Channels.find({name: "random"})).not.toBe(null);

        // expect(Channels.find({name: "blik"})).toThrow();
    });
});

describe('Collection: Messages', function () {
    it("on startup there should not be any messages", function () {
        expect(Messages.find().count()).toEqual(0);
    });
});
