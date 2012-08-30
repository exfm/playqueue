"use strict";

var songUrlZero = 'http://serve.castfire.com/audio/1136016/'+
    'frog-nancy-kerrigan_2012-08-28-170816.128.mp3';
var songUrlOne = 'http://serve.castfire.com/audio/1133808/'+
    'such-gold-keyhole-m-o_2012-08-27-175708.128.mp3';
var songUrlTwo = 'http://serve.castfire.com/audio/1129506/'+
    'solos-carpe-diem_2012-08-24-172906.128.mp3';
var songUrlThree = 'http://serve.castfire.com/audio/1129504/'+
    'fierce-creatures-catacomb-party_2012-08-24-172704.128.mp3';
    
function createNewPlayQueue(){
    var pq = new PlayQueue(
        {
            'audio' : new Audio()
        }
    );
    return pq;
}

function addSongs(pq){
    pq.add([
        {
            'id': '0',
            'url': songUrlZero
        },
        {
            'id': '1',
            'url': songUrlOne
        },
        {
            'id': '2',
            'url': songUrlTwo
        },
        {
            'id': '3',
            'url': songUrlThree
        }
    ]);
}

describe("PlayQueue", function(){
    describe("list", function(){
        describe("main", function(){
            it("should have an internal array to hold songs", function(){
                var pq = createNewPlayQueue();
                assert.equal(typeof(pq.getList()), 'object');
                assert.equal(pq.getList().length, 0);
            });
            it("should return the array on getList call", function(){
                var pq = createNewPlayQueue();
                pq.add(songUrlZero);
                assert.equal(JSON.stringify(pq.getList()), 
                    '[{"url":"'+songUrlZero+'","_listPosition":0}]');
            });
            it("should fire a 'listChanged' event when refreshed", function(done){
                var pq = createNewPlayQueue();
                pq.add(songUrlZero);
                pq.addEventListener('listChanged', function(e){
                    assert.equal(e.type, 'listChanged');
                    done();
                });
                pq.refreshList();
            });
        }); // end main
        
        describe("opts", function(){
            it("should not accept a SoundCloud key unless it's a string", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'soundcloud_key': {}
                            }
                        )
                    }, /soundcloud_key must be a string/
                );
            });
        });
        
        describe("add", function(){
            it("should add an array of song objects to list", function(){
                var pq = createNewPlayQueue();
                pq.add([
                    {
                        'id': '0',
                        'url': songUrlZero
                    },
                    {
                        'id': '1',
                        'url': songUrlOne
                    }
                ]);
                assert.equal(pq.getList().length, 2);
            });
            it("should add a song object to list", function(){
                var pq = createNewPlayQueue();
                pq.add({
                    'id': '0',
                    'url': songUrlZero
                });
                assert.equal(pq.getList().length, 1);
            });
            it("should create new song object with given url string and add to list", function(){
                var pq = createNewPlayQueue();
                pq.add(songUrlZero);
                assert.equal(pq.getList().length, 1);
                assert.equal(typeof(pq.getList()[0]), 'object');
            });
        }); // end add

        describe("remove", function(){
            it("should remove an item at a specific index", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.equal(pq.getList().length, 4);
                pq.remove(1);
                assert.equal(pq.getList().length, 3);
                pq.remove(0);
                assert.equal(pq.getList().length, 2);
            });
            it("should clear all items", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.equal(pq.getList().length, 4);
                pq.clear();
                assert.equal(pq.getList().length, 0);
                assert.equal(pq.getQueueNumber(), 0);
                assert.equal(pq.isShuffled(), false);
                assert.equal(pq.isStopped(), true);
            });
        }); // end remove
        
        describe("move", function(){
            it("should move a song from one position to another", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                pq.move(0, 1);
                assert.equal(pq.getList()[1].url, songUrlZero);
                assert.equal(pq.getList()[1].id, '0');
                assert.equal(pq.getList()[1]._listPosition, 1);
            });
            it("should re-order all songs effected after one moves", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                pq.move(1, 2);
                assert.equal(pq.getList()[0].url, songUrlZero);
                assert.equal(pq.getList()[1].url, songUrlTwo);
                assert.equal(pq.getList()[2].url, songUrlOne);
                assert.equal(pq.getList()[3].url, songUrlThree);
                assert.equal(pq.getList()[0]._listPosition, 0);
                assert.equal(pq.getList()[1]._listPosition, 1);
                assert.equal(pq.getList()[2]._listPosition, 2);
                assert.equal(pq.getList()[3]._listPosition, 3);
            });
            it("not allow you to move a song to the same position", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.throw(
                    (function(){
                        pq.move(0,0);
                    }), /Cannot move item into it's own position/
                );
            });
            it("not allow you to move a song to a position greater than the list length", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.throw(
                    function(){
                        pq.move(0, 100);
                    }, /moveToIndex out of bounds/
                );
            });
            it("not allow you to move a song in a position greater than the list length", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.throw(
                    function(){
                        pq.move(100, 0);
                    }, /itemIndex out of bounds/
                );
            });
        }); // end move
        
    }); // end list
});
