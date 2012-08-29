"use strict";

describe("PlayQueue", function(){
    describe("add", function(){
        it("should add items", function(){
            var pq = new PlayQueue();
            pq.add({
                'id': 1,
                'url': 'blarg'
            });
            assert.notEqual(pq.getItem(1), null);
        });

        it("should not throw fakeies");
    });

    describe("remove", function(){
        it("should remove items");
    });
});
