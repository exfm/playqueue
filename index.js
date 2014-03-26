(function(){

var storage = require('local-storage-json'),
    _ = require('underscore');

// constructor
function PlayQueue(opts){
    
    // The list array
    this.list = [];
    
    // Boolean if we should fire 'ended' event manually.
    // Mobile safari doesn't always fire 'ended' event. This will 
    // look at the time and fire it manually when it's .1 to end
    this.notify_before_end = false;
    
    // Boolean if we already fired the fake 'ended' event
    this.before_end_notified = false;
    
    // Boolean if calling 'previous' function should start current song
    // playing again if we are more than 10 seconds in
    this.smart_previous = true;
    
    // Boolean if we should automatically go to next song when current
    // song ends. Good to set to false if client goes offline so it 
    // doesn't skip through all songs
    this.autoNext = true;
    
    // if we are on the last song, user can click next 
    // and it will skip and fire stop events
    this.userCanStop = false;
    
    // Number of milliseconds we should wait before deciding the current
    // song loading is not going to load and we should call next
    this.load_timeout = 15000;
    
    // Boolean if we should store list, queueNumber 
    // and shuffled state in localStorage
    this.use_local_storage = false;
    
    // Number of list length cap. -1 means no cap
    this.lengthCap = -1;
    
    // Boolean if we should fire 'songHalf' event at halp point of playing song
    this.notify_song_half = false;

    // Boolean if we already fired the song half event
    this.song_half_notified = false;

    // The position of current song in list
    this.queueNumber = 0;

    // Boolean if the list is shuffled or not
    this.isShuffled = false;

    // Boolean is the audio is stopped vs. playing/paused
    this.isStopped = true;

    // Timeout for song load fails
    this.loadTimeout;
    
    // namespace for localStorage
    this.localStorageNS = 'exPlayQueue_';
    
    // should we first check if client is online before
    // trying to load a song
    this.checkOnlineStatus = false;
    
    // if not null, this func must return true
    // to play a song
    this.validatePlayFunction = null;
    
    // should we first check the connection type
    // before setting the timeout time?
    // for Cordova only
    this.checkConnection = false;
    
    // Arrays for event listeners
    this.listeners = {
        'nextTrack' : [],
        'previousTrack' : [],
        'added' : [],
        'playing' : [],
        'songHalf' : [],
        'loading' : [],
        'stop' : [],
        'shuffleToggled' : [],
        'listChanged' : [],
        'play' : [],
        'pause' : [],
        'error': []
    };
    
     // Which song properties do we need?
    var savedSongProperties = ['url', '_listPosition'];
    this.savedSongProperties = opts.savedSongProperties || savedSongProperties;
    if(_.indexOf(this.savedSongProperties, '_listPosition') === -1){
        this.savedSongProperties.push('_listPosition');
    }
    
    // soundcloud needs a consumer key to play songs
    if(opts && opts.soundcloud_key){
        if (typeof(opts.soundcloud_key) == "string"){
            this.soundcloud_key = opts.soundcloud_key;
        } 
        else {
            throw new TypeError("soundcloud_key must be a string");
        }
    }
    
    // mobile safari doesn't always fire 'ended' event. This will 
    // look at the time and fire it manually when it's .1 to end
    if(opts && opts.notify_before_end){
        if (typeof(opts.notify_before_end) == "boolean"){
            this.notify_before_end = opts.notify_before_end;
        } 
        else {
            throw new TypeError("notify_before_end must be a boolean");
        }
    }
    
    // this will fire an event when the song is halfway done. 
    // useful  for scrobbling
    if(opts && opts.notify_song_half){
        if (typeof(opts.notify_song_half) == "boolean"){
            this.notify_song_half = opts.notify_song_half;
        } 
        else {
            throw new TypeError("notify_song_half must be a boolean");
        }
    }
    
    // this will skip the current loading song after certain time has passed
    if(opts && opts.load_timeout){
        if (typeof(opts.load_timeout) == "number"){
            this.load_timeout = opts.load_timeout;
        } 
        else {
            throw new TypeError("load_timeout must be a number");
        }
    }
    
    // this will save the list, queueNumber and shuffled state to localStorage
    if(opts && opts.use_local_storage){
        if (typeof(opts.use_local_storage) == "boolean"){
            this.use_local_storage = opts.use_local_storage;
            if (this.use_local_storage == true){
                this.list =  storage.get(this.localStorageNS + 'list') || [];
                this.queueNumber = storage.get(this.localStorageNS + 'queueNumber') || 0;
                this.isShuffled = storage.get(this.localStorageNS + 'isShuffled') || false;
            }
        } 
        else {
            throw new TypeError("use_local_storage must be a boolean");
        }
    }
    
    // this will cap the list length at a certain number. 
    if(opts && opts.length_cap){
        if (typeof(opts.length_cap) == "number"){
            this.length_cap = opts.length_cap;
        } 
        else {
            throw new TypeError("length_cap must be a number");
        }
    }
    
    // audio is required!
    if(opts && opts.audio) {
        this.audio = opts.audio;
        this.addAudioListeners();
    } else {
        throw new TypeError("PlayQueue requires an Audio object");
        return;
    }
    
    this.addEventListener(
        "listChanged", 
        this.saveLocally.bind(this), 
        false
    ); 
}

// Add listeners to audio object
PlayQueue.prototype.addAudioListeners = function(){
    this.audio.addEventListener(
        'canplay', 
        this.canPlay.bind(this), 
        false
    );
    var bindedTimeUpdate = false;
    if(this.notify_before_end == true){
        this.audio.addEventListener(
            'timeupdate', 
            this.timeUpdate.bind(this), 
            false
        );
        bindedTimeUpdate = true;
    } 
    else{
        this.audio.addEventListener(
            'ended', 
            this.next.bind(this), 
            false
        );
    }
    if(this.notify_song_half == true && bindedTimeUpdate == false){
        this.audio.addEventListener(
            'timeupdate', 
            this.timeUpdate.bind(this), 
            false
        );
    }
    this.audio.addEventListener(
        'error', 
        this.error.bind(this), 
        false
    );
    this.audio.addEventListener(
        'play', 
        this.audioOnPlay.bind(this), 
        false
    );
    this.audio.addEventListener(
        'pause', 
        this.audioOnPause.bind(this), 
        false
    );
    this.audio.addEventListener(
        'remoteprevious', 
        this.previous.bind(this), 
        false
    );
    this.audio.addEventListener(
        'remotenext', 
        this.next.bind(this), 
        false
    );
}

// return the list of songs
PlayQueue.prototype.getList = function(){
    return this.list || [];
}

// return the current queue position
PlayQueue.prototype.getQueueNumber = function(){
    return this.queueNumber || 0;
}

// set the current queue position
PlayQueue.prototype.setQueueNumber = function(queueNumber){
    this.queueNumber = queueNumber;
    if(this.use_local_storage == true){
        storage.set(this.localStorageNS + 'queueNumber', this.queueNumber);
    }
}

// get the current song
PlayQueue.prototype.getSong = function(){
    return this.getList()[this.getQueueNumber()] || null;
}

// returns a new song object only with properties in savedSongProperties
PlayQueue.prototype.getSavedSong = function(song){
    return _.pick(song, this.savedSongProperties);
}

// Save the list, queueNumber and shuffled state to localStorage
PlayQueue.prototype.saveLocally = function(){
    if (this.use_local_storage === true){
        storage.set(this.localStorageNS + 'list', this.getList());
        storage.set(this.localStorageNS + 'queueNumber', this.getQueueNumber());
        storage.set(this.localStorageNS + 'isShuffled', this.isShuffled);
    }
}

// add songs to the list. Takes an array of objects,
// a single object or a single url string
PlayQueue.prototype.add = function(songs){
    var list = this.getList();
    var currentListLen = list.length;
    var queueNumber = this.getQueueNumber();
    var added = [];
    if(_.isString(songs)){
        var song = {
            'url': songs, 
        }
        added.push(song)
    }
    if(_.isObject(songs)){
        if(_.isArray(songs)){
            added = _.map(
                songs,
                function(song){
                    return song;
                }
            );
        }
        else{
            added.push(songs);
        }
    }
    _.each(
        added,
        function(song, index){
            song._listPosition = currentListLen + index;
        }.bind(this)
    );
    if(this.getShuffled() === true){
        var firstPart = _.first(list, queueNumber + 1);
        var remainingPart = _.rest(list, queueNumber + 1);
        var shuffledPart = _.shuffle(remainingPart.concat(added));
        this.list = firstPart.concat(shuffledPart);
    }
    else{
        this.list = this.list.concat(added);
    }
    this.dispatchListChanged(
        this.list, 
        this.getQueueNumber(), 
        added, 
        [], 
        currentListLen, 
        currentListLen, 
        this.list.length
    );
}

// remove a song from the list by index
PlayQueue.prototype.remove = function(n){
    var currentListLen = this.getList().length;
    var returnValue = -1;
    var list = this.getList();
    var queueNumber = this.getQueueNumber();
    if(_.isObject(list[n]) === true){
        if(queueNumber === n){
            if (this.audio.paused === false){
                this.next(true);
            }
        }
        if(queueNumber >= n){
            queueNumber--;
            this.setQueueNumber(queueNumber);
        }
        var removed = list.splice(n, 1);
        this.updateListPositions(removed[0]._listPosition);
        var newList = this.getList();
        this.dispatchListChanged(
            newList, 
            this.getQueueNumber(), 
            [], 
            removed, 
            null, 
            currentListLen, 
            newList.length
        );
        returnValue = n;
    }
    return returnValue;
}

// clear the list, reset queueNumber, shuffled
PlayQueue.prototype.clear = function(){
    var removed = this.getList().concat([]);
    this.list = [];
    this.setQueueNumber(0);
    this.setShuffled(false);
    this.stop();
    this.dispatchListChanged(
        [], 
        this.getQueueNumber(), 
        [], 
        removed, 
        null, 
        0, 
        0
    );
}

// move a song from one psoition to another
PlayQueue.prototype.move = function(itemIndex, moveToIndex){
    if(itemIndex === moveToIndex){
        throw new TypeError("Cannot move item into it's own position");
    } 
    var list = this.getList();
    var len = list.length - 1;
    if(len < itemIndex){
        throw new TypeError("itemIndex out of bounds");
    }
    if(len < moveToIndex){
        throw new TypeError("moveToIndex out of bounds");
    }
    var song = list.splice(itemIndex, 1);
    list.splice(moveToIndex, 0, song[0]);
    if(this.getShuffled === false){
        this.updateListPositions();
    }
    var queueNumber = this.getQueueNumber();
    if(queueNumber === itemIndex){
        this.setQueueNumber(moveToIndex);
    } 
    else{
        if(itemIndex < queueNumber && moveToIndex >= queueNumber){
            var q = queueNumber - 1;
            this.setQueueNumber(q);
        }
        if(itemIndex > this.queueNumber && moveToIndex <= this.queueNumber){
            var q = queueNumber + 1;
            this.setQueueNumber(q);
        }
    }
    var newList = this.getList();
    this.dispatchListChanged(
        newList, 
        this.queueNumber, 
        [], 
        [], 
        null, 
        newList.length, 
        newList.length
    );
}

// after the list was manipulated, 
// update the _listPosition property on each song
PlayQueue.prototype.updateListPositions = function(n){
    var num = n || 0;
    var list = this.getList();
    if (this.getShuffled() === false){
        _.each(
            list,
            function(song, index){
                song._listPosition = index;
            }
        );
    }
    else{
        _.each(
            list,
            function(song){
                if(song._listPosition > num){
                    song._listPosition--;
                }
            }
        );   
    }
}

// play a song at a given index
PlayQueue.prototype.play = function(n){
    this.canPlayCalled = false;
    var shouldPlay = true;
    var list = this.getList();
    var proposedSong = list[n];
    var isSong = _.isObject(proposedSong);
    if(this.validatePlayFunction !== null){
        shouldPlay = this.validatePlayFunction(proposedSong);
    }
    if(shouldPlay === true){
        var shouldLoad = this.checkOnlineStatusShouldLoad(proposedSong, isSong);
        if(shouldLoad === true){
            if(isSong === true){
                clearTimeout(this.loadTimeout);
                this.isStopped = false;
                this.song_half_notified = false;
                this.before_end_notified = false;
                var song = proposedSong;
                var url = this.checkForSoundcloudUrl(song.url);
                this.setQueueNumber(n);
                this.audio.src = url;
                this.audio.load();
                this.dispatchEvent(
                    'loading', 
                    {
                        'song': song, 
                        'queueNumber': this.getQueueNumber(), 
                        'audio': this.getAudioProperties()
                    }
                );
                if(this.load_timeout !== -1){
                    this.loadTimeout = setTimeout(
                        this.timeoutLoading.bind(this), 
                        this.load_timeout
                    );
                }
                this.cut();
            } 
            else {
                throw new TypeError("Index out of bounds. Got: "
                    + n + " Length: "+ list.length);
            }
        }
        else{
            this.dispatchEvent('offline');    
        }
    }
    else{
        this.dispatchEvent('validatePlayFunctionFalse');
    }
}

// if we have a length cap on list size
// cut out some songs
PlayQueue.prototype.cut = function(){
    if(this.length_cap !== -1){
        var list = this.getList();
        var currentListLen = list.length; 
        var queueNumber = this.getQueueNumber();
        if(currentListLen > this.length_cap){
            var cutNumber = currentListLen - this.length_cap;
            if(queueNumber < cutNumber){
                cutNumber = queueNumber - 1;
            }
            queueNumber -= cutNumber;
            this.setQueueNumber(queueNumber);
            var removed = list.splice(0, cutNumber);
            this.updateListPositions(0);
            this.dispatchListChanged(
                this.getList(), 
                this.getQueueNumber(), 
                [], 
                removed, 
                null, 
                currentListLen, 
                this.getList().length
            );
        }
    }
}

// if url is from soundcloud
// add soundcloud key if we have one
PlayQueue.prototype.checkForSoundcloudUrl = function(url){
    if(this.soundcloud_key !== null){
        if(url.indexOf("soundcloud.com") !== -1){
            if (url.indexOf("?") === -1){
                url = url+"?consumer_key="+this.soundcloud_key;
            } 
            else{
                url = url+"&consumer_key="+this.soundcloud_key;
            }
        }
    }
    return url;
}

// if we should check for online status
// see if we are online or off
// see if song can be played while offline
PlayQueue.prototype.checkOnlineStatusShouldLoad = function(song, isSong){
    var shouldLoad = true;
    if(this.checkOnlineStatus === true){
        if(navigator.onLine === false){
            shouldLoad = false;
            if(isSong === true){
                if(song.offline && song.offline === true){
                    shouldLoad = true;
                }
            }
        }
    }
    return shouldLoad;
}

// This will toggle paused state of audio. 
// If stopped, will start playing first song
PlayQueue.prototype.playPause = function(){
    if(this.isStopped){
        if(this.getSong() !== null){
            this.play(this.getQueueNumber());
        }
    } 
    else{
        if(this.audio.paused){
            this.audio.play();
        } 
        else{
            this.audio.pause();
        }
    }
}

// This will pause the current audio
PlayQueue.prototype.pause = function(){
    this.audio.pause();
}

// Fires 'playing' event when 'canplay' audio event is fired. 
// Adds some useful data
PlayQueue.prototype.canPlay = function(){
    this.canPlayCalled = true;
    this.audio.play();
    this.dispatchEvent("playing", 
        {
            'song': this.getSong(), 
            'queueNumber': this.getQueueNumber(),  
            'audio': this.getAudioProperties()
        }
    );
}

// Fires 'error' event song cannot load or has timed out 
// Then calls nexy
PlayQueue.prototype.error = function(){
    this.dispatchEvent("error", 
        {
            'song': this.getSong(), 
            'queueNumber': this.getQueueNumber(),  
            'audio': this.getAudioProperties()
        }
    );
    this.next(
        {
            'type': "ended"
        }
    );
}

// Listener on audio timeupdate
// Handles notify_before_end and notify_song_half
PlayQueue.prototype.timeUpdate = function(){
    if(this.notify_before_end == true 
        && this.audio.duration > 0 
        && this.audio.duration - this.audio.currentTime < .5
        && this.before_end_notified == false
    ){
        this.before_end_notified = true;
        this.next(
            {
                'type': "ended"
            }
        );
    }
    if(this.notify_song_half == true 
        && this.song_half_notified == false 
        && this.audio.currentTime / this.audio.duration > .5
    ){
        this.song_half_notified = true;
        this.dispatchEvent('songHalf', 
            {
                'song': this.getSong(), 
                'queueNumber': this.getQueueNumber()
            }
        );
    }
}

// This is called when loadTimeout is reached
// If song has not started, next is called
PlayQueue.prototype.timeoutLoading = function(){
    if(this.canPlayCalled === false){
        this.error();
    }
}

// This is called to skip to the next song in the list
// Called automatically when a song ends
// If there are no more songs in the list, calles stop
PlayQueue.prototype.next = function(e){
    // not user initiated
    if(e && e.type === 'ended'){
        if(this.getQueueNumber() < this.getList().length - 1
            && this.autoNext === true){
            this._goNext();
        }
        else{
            this.stop();
        } 
    }
    // user initiated
    else{
        if(this.getQueueNumber() < this.getList().length - 1){
            this._goNext();
        }
        else{
            if(this.userCanStop === true){
                this.stop();
            } 
        }
    }
}

// actually skip to the next song
PlayQueue.prototype._goNext = function(e){
    var q = this.getQueueNumber() + 1;
    this.setQueueNumber(q);
    this.play(q);
    this.dispatchEvent(
        'nextTrack', 
        {
            'song': this.getSong(), 
            'queueNumber': this.getQueueNumber()
        }
    );
}

// This is called to go to the previous song in the list
// If smart_previous is true, it will go back to current song
// when it is over 10 seconds in. Or else it will go to previous song
PlayQueue.prototype.previous = function(){
    if(this.smart_previous == true){
        if(this.audio.currentTime > 10){
            this.audio.currentTime = 0;
        } 
        else {
            if(this.getQueueNumber() > 0){
                var q = this.getQueueNumber() - 1;
                this.setQueueNumber(q);
                this.play(q);
                this.dispatchEvent('previousTrack', 
                    {
                        'song': this.getSong(), 
                        'queueNumber': this.getQueueNumber()
                    }
                );
            }
        }
    } 
    else{
        if(this.getQueueNumber() > 0){
            var q = this.getQueueNumber() - 1;
            this.setQueueNumber(q);
            this.play(q);
            this.dispatchEvent('previousTrack', 
                {
                    'song': this.getSong(), 
                    'queueNumber': this.getQueueNumber()
                }
            );
        }
    }
}

// This is called when we reach the end of the list
// Reset queueNumber
PlayQueue.prototype.stop = function(){
    this.isStopped = true;
    this.dispatchEvent('stop', 
        {
            'audio': this.getAudioProperties()
        }
    );
}

// get the shuffled State
PlayQueue.prototype.getShuffled = function(){
    return this.isShuffled || false;
}

// Set shuffled state
PlayQueue.prototype.setShuffled = function(b, start){
    if(b === true){
        if(this.getShuffled() === false){
            this.shuffleList(start);
        }
    }
    if(b === false){
        if(this.getShuffled() === true){
            this.unShuffleList(start);
        }
    } 
    return this.getShuffled(); 
}

// Toggled shuffled state
PlayQueue.prototype.toggleShuffle = function(start){
    if(this.getShuffled() === true){
        this.unShuffleList(start);
    } 
    else{
        this.shuffleList(start);
    }
    return this.getShuffled();
}

// Shuffle the list. 
PlayQueue.prototype.shuffleList = function(start){
    var list = this.getList();
    var len = list.length;
    if (len > 0){
        start = start || 0;
        var firstPart = _.first(list, start);
        var shuffledPart = _.shuffle(_.rest(list, start)); 
        var newList = firstPart.concat(shuffledPart);
        var newListLen = newList.length;
        var currentSong = this.getSong();
        if(currentSong._listPosition >= start){
            _.find(
                newList,
                function(song, index){
                    if(song._listPosition === currentSong._listPosition){
                        newList.splice(index, 1);
                        newList.splice(start, 0, song);
                        return true
                    }
                }
            );
        }
        this.list = [].concat(newList);
        this.setQueueNumber(start);
    }
    this.isShuffled = true;
    this.dispatchListChanged(
        this.getList(), 
        this.getQueueNumber(), 
        [], 
        [], 
        null, 
        this.getList().length,
        this.getList().length
    );
    this.dispatchEvent('shuffleToggled', 
        {
            'queueNumber': this.getQueueNumber(), 
            'isShuffled': this.getShuffled(), 
            'list': this.getList(),
            'shuffledPart': shuffledPart
        }
    );
}

// Un-shuffle the list
PlayQueue.prototype.unShuffleList = function(){
    var list = this.getList();
    var len = list.length;
    var song = this.getSong();
    if (len > 0){
        var newList = _.sortBy(
            list,
            function(song){
                return song._listPosition;
            }
        ); 
        var queueNumber = song._listPosition;
        this.setQueueNumber(queueNumber);
        this.list = [].concat(newList);
    }
    this.isShuffled = false;
    this.dispatchListChanged(
        this.getList(), 
        this.getQueueNumber(), 
        [], 
        [], 
        null, 
        len, 
        len
    );
    this.dispatchEvent('shuffleToggled', 
        {
            'queueNumber': this.getQueueNumber(), 
            'isShuffled': this.getShuffled(), 
            'list': this.getList(), 
            'shuffledPart': []
        }
    );
}

// Return current audio properties plus some useful data
PlayQueue.prototype.getAudioProperties = function(){
    return {
        'paused': this.audio.paused,
        'isStopped': this.isStopped,
        'currentTime': this.audio.currentTime,
        'duration': this.audio.duration,
        'src': this.audio.src,
        'volume': this.audio.volume,
        'queueNumber': this.getQueueNumber(),
        'song': this.getSong()
    }
}

// Force a 'listChanged' event to trigger
PlayQueue.prototype.refreshList = function(){
    var newList = this.getList();
    var len = newList.length;
    this.dispatchListChanged(
        newList, 
        this.getQueueNumber(), 
        [], 
        [], 
        null, 
        len, 
        len
    );
}

// Trigger play event when audio play is triggered adding some useful data
PlayQueue.prototype.audioOnPlay = function(e){
    this.dispatchEvent('play', 
        {
            'song': this.getSong(), 
            'audio': this.getAudioProperties(), 
            'queueNumber': this.getQueueNumber()
        }
    );
}

// Trigger pause event when audio play is triggered adding some useful data
PlayQueue.prototype.audioOnPause = function(e){
    this.dispatchEvent('pause', 
        {
            'song': this.getSong(), 
            'audio': this.getAudioProperties(), 
            'queueNumber': this.getQueueNumber()
        }
    );
}

// Return song in list at index provided
PlayQueue.prototype.getSongAt = function(position){
    return this.getList()[position];
}

// Seek audio by percentage of song
// Percentage range = 0-1
PlayQueue.prototype.seek = function(percentage){
    if (!isNaN(this.audio.duration)){
        this.audio.currentTime = Math.floor(percentage * this.audio.duration);
    }
}

// Call this to trigger 'listChanged' event
PlayQueue.prototype.dispatchListChanged = function(
        list, 
        queueNumber, 
        added, 
        removed, 
        positionAddedAt, 
        oldListLength, 
        newListLength
    ){
    this.dispatchEvent('listChanged', 
        {
            'list': list, 
            'queueNumber': queueNumber, 
            'added': added,
            'removed': removed,
            'positionAddedAt': positionAddedAt, 
            'oldListLength': oldListLength, 
            'newListLength': newListLength,
            'isShuffled': this.isShuffled
        }
    );
}

// Event emitter add
PlayQueue.prototype.addEventListener = function(eventName, callback, b){
    for(var i in this.listeners){
        if(eventName == i){
            this.listeners[i].push(callback);
            break;
        };
    };
};

// Event emitter on
PlayQueue.prototype.on = function(eventName, callback){
    this.addEventListener(eventName, callback, false);
};

// Event emitter remove
PlayQueue.prototype.removeEventListener = function(type, fn){
    if(typeof this.listeners[type] != 'undefined') {
        for(var i = 0, l; l = this.listeners[type][i]; i++) {
            if (l == fn) break;
        }
        this.listeners[type].splice(i, 1);
    }
};

// Event emitter off
PlayQueue.prototype.off = function(type, fn){
    this.removeEventListener(type, fn);
};

// Event emitter trigger
PlayQueue.prototype.dispatchEvent = function(type, object){
    if(typeof this.listeners[type] != 'undefined' && this.listeners[type].length) {
        var array = this.listeners[type].slice();
        for (var i = 0, l; l = array[i]; i++) {
            var timeStamp = new Date().getTime();
            l.apply(object, [
                {
                    'type': type, 
                    'timeStamp': timeStamp, 
                    'target': object
                }
            ]);
        }
        return true;           
    }
    return false;
};
    
// check if we've got require
if(typeof module !== "undefined"){
    module.exports = PlayQueue;
}
else{
    window.PlayQueue = PlayQueue;
}

}()); // end wrapper