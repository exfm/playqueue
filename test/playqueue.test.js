"use strict";

var songUrlZero = 'music/test0.mp3';
var songUrlOne = 'music/test1.mp3';
var songUrlTwo = 'music/test2.mp3';
var songUrlThree = 'music/test3.mp3';
    
function createNewPlayQueue(){
    var a = new Audio();
    a.volume = 0;
    var pq = new PlayQueue(
        {
            'audio': a
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
            it("should return the correct song when queried by position", function(){
                var pq = createNewPlayQueue();
                pq.add(songUrlZero);
                assert.equal(JSON.stringify(pq.getSongAt(0)), 
                    '{"url":"'+songUrlZero+'","_listPosition":0}');
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
            it("should not accept notify_before_end unless it's a boolean", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'notify_before_end': 'foo'
                            }
                        )
                    }, /notify_before_end must be a boolean/
                );
            });
            it("should not accept notify_song_half unless it's a boolean", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'notify_song_half': 'foo'
                            }
                        )
                    }, /notify_song_half must be a boolean/
                );
            });
            it("should not accept load_timeout unless it's a number", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'load_timeout': 'foo'
                            }
                        )
                    }, /load_timeout must be a number/
                );
            });
            it("should not accept use_local_storage unless it's a boolean", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'use_local_storage': 'foo'
                            }
                        )
                    }, /use_local_storage must be a boolean/
                );
            });
            it("should not accept length_cap unless it's a boolean", function(){
                assert.throw(
                    function(){
                        new PlayQueue(
                            {
                                'audio' : new Audio(),
                                'length_cap': 'foo'
                            }
                        )
                    }, /length_cap must be a number/
                );
            });
            it("should throw an error if no audio object is passed in", function(){
                assert.throw(
                    function(){
                        new PlayQueue()
                    }, /EXPlayQueue requires an Audio object/
                );
            });
        }); // end opts
        
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
                assert.equal(pq.isShuffled, false);
                assert.equal(pq.isStopped, true);
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
            it("should not allow you to move a song to the same position", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.throw(
                    (function(){
                        pq.move(0,0);
                    }), /Cannot move item into it's own position/
                );
            });
            it("should not allow you to move a song to a position greater than the list length", function(){
                var pq = createNewPlayQueue();
                addSongs(pq);
                assert.throw(
                    function(){
                        pq.move(0, 100);
                    }, /moveToIndex out of bounds/
                );
            });
            it("should not allow you to move a song in a position greater than the list length", function(){
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
    
    describe("controls", function(){
        it("should play song by index", function(done){
            var pq = createNewPlayQueue();
            pq.add(songUrlZero);
            pq.addEventListener('loading', function(e){
                assert.equal(e.type, 'loading');
                assert.equal(e.target.audio.song.url, songUrlZero);
                done();
            });
            pq.play(0);
        });
        it("should toggle to paused state with one function call", function(done){
            var pq = createNewPlayQueue();
            addSongs(pq);
            pq.audio.addEventListener('pause', function(e){
                assert.equal(e.type, 'pause');
                done();
            });
            pq.addEventListener('playing', function(e){
                pq.playPause();
            });
            pq.play(0);
        });
        it("should toggle back to un-paused state with one function call", function(done){
            var pq = createNewPlayQueue();
            addSongs(pq);
            pq.addEventListener('playing', function(e){
                pq.playPause();
                pq.audio.addEventListener('play', function(e){
                    assert.equal(e.type, 'play');
                    done();
                });
                pq.playPause();
            });
            pq.play(0);
        });
        it("should go to next song when next is called", function(done){
            var pq = createNewPlayQueue();
            addSongs(pq);
            pq.addEventListener('playing', function(e){
                pq.next();
                done();
            });
            pq.play(0);
        });
    }); // end controls
    
    describe("shuffle", function(){
        it("should shuffle a list of songs");
        it("should un-shuffle a list of songs");
        it("should toggle shuffle on a list of songs with one function call");
    }); // end shuffle
    
     describe("audio", function(){
        it("should seek to a point in the song by percentage");
        it("should trigger an event when audio pauses with added properties");
        it("should trigger an event when audio plays with added properties");
        it("should trigger an event when audio reaches half point");
        it("should trigger an event when audio is about to end");
    }); // end audio
    
    describe("localstorage", function(){
        it("should save the list to localStorage");
        it("should retrieve the list from localStorage");
        it("should save the queueNumber to localStorage");
        it("should retrieve the queueNumber from localStorage");
    }); // end shuffle
});
