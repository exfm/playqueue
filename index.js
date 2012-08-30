(function(){
    "use strict";

    function PlayQueue(opts){
        this.audio = null;
this.soundcloud_key = null;
this.notify_before_end = false;
this.notify_song_half = false;
this.smart_previous = true;
this.load_timeout = 15000;
this.use_local_storage = false;
this.lengthCap = -1;
this.getList = function(){
    return _getList.apply(this);
}
this.getLocalStorageList = function(){
    return _getLocalStorageList.apply(this);
}
this.getQueueNumber = function(){
    return _queueNumber;
}
this.getLocalStorageQueueNumber = function(){
    return _getLocalStorageQueueNumber.apply(this);
}
this.getSong = function(){
    return _getSong.apply();
}
this.add = function(songs){
    _add.apply(this, [songs]);
}
this.remove = function(removeAtIndex){
    return _remove.apply(this, [removeAtIndex]);
}
this.clear = function(removeAtIndex){
    _clear.apply(this);
}
this.move = function(itemIndex, moveToIndex){
    _move.apply(this, [itemIndex, moveToIndex]);
}
this.play = function(playAtIndex){
    _play.apply(this, [playAtIndex]);
}
this.playPause = function(){
    _playPause.apply(this);
}
this.next = function(){
    _next.apply(this);
}
this.previous = function(){
    _previous.apply(this);
}
this.isStopped = function(){
    return _isStopped;
}
this.stop = function(){
    _stop.apply(this);
}
this.isShuffled = function(){
    return _isShuffled;
}
this.setShuffled = function(b, start){
    _setShuffled.apply(this, [b, start]);
}
this.toggleShuffle = function(start){
    _toggleShuffle.apply(this, [start]);
}
this.getAudioProperties = function(){
    return _getAudioProperties.apply(this);
}
this.refreshList = function(){
    _refreshList.apply(this);
}
this.seek = function(percentage){
    _seek.apply(this, [percentage]);
}
this.getSongAt = function(position){
    return _getSongAt.apply(this, [position]);
}
this.addEventListener = function(eventName, callback, b){
	_addEventListener.apply(this, [eventName, callback, b]);
};
this.removeEventListener = function(type, fn){
	_removeEventListener.apply(this, [type, fn]);
};
this.savedSongProperties = ['id', 'url', 'title',
                        'artist', 'album', 'buy_link',
                        'image', 'source', 'viewer_love',
                        'user_love', '_listPosition'];
                        
                        
                        
var _song_half_notified = false;
var _list = [];
var _queueNumber = 0;
var _isShuffled = false;
var _isStopped = true;
var _loadTimeout;
var _listeners = {
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
	'pause' : []
};
_setOptions.apply(this, [opts]);
function _setOptions(opts){
    if (opts && opts.soundcloud_key){
        if (typeof(opts.soundcloud_key) == "string"){
            this.soundcloud_key = opts.soundcloud_key;
        } else {
            throw new TypeError("soundcloud_key must be a string");
        }
    }
    if (opts && opts.notify_before_end){
        if (typeof(opts.notify_before_end) == "boolean"){
            this.notify_before_end = opts.notify_before_end;
        } else {
            throw new TypeError("notify_before_end must be a boolean");
        }
    }
    if (opts && opts.notify_song_half){
        if (typeof(opts.notify_song_half) == "boolean"){
            this.notify_song_half = opts.notify_song_half;
        } else {
            throw new TypeError("notify_song_half must be a boolean");
        }
    }
    if (opts && opts.load_timeout){
        if (typeof(opts.load_timeout) == "number"){
            this.load_timeout = opts.load_timeout;
        } else {
            throw new TypeError("load_timeout must be a number");
        }
    }
    if (opts && opts.use_local_storage){
        if (typeof(opts.use_local_storage) == "boolean"){
            this.use_local_storage = opts.use_local_storage;
            if (this.use_local_storage == true){
                _list = _getLocalStorageList().concat([]);
                _queueNumber = _getLocalStorageQueueNumber();
                _isShuffled = _getLocalStorageIsShuffled();
            }
        } else {
            throw new TypeError("use_local_storage must be a boolean");
        }
    }
    if (opts && opts.length_cap){
        if (typeof(opts.length_cap) == "number"){
            this.length_cap = opts.length_cap;
        } else {
            throw new TypeError("length_cap must be a number");
        }
    }
    if (opts && opts.audio) {
        this.audio = opts.audio;
        _addAudioListeners.apply(this);
    } else {
        throw new TypeError("EXPlayQueue requires an Audio object");
        return;
    }
    _addEventListener("listChanged", _saveLocally.bind(this), false);
    try { 
        window.addEventListener("storage", function(e){
            _onStorageChange.apply(this, [e]);
        }, false);
    } catch(e){}
}
function _addAudioListeners(){
    this.audio.addEventListener("canplay", _canPlay.bind(this), false);
    var bindedTimeUpdate = false;
    if (this.notify_before_end == true){
        this.audio.addEventListener("timeupdate", _timeUpdate.bind(this), false);
        bindedTimeUpdate = true;
    } else {
        this.audio.addEventListener("ended", _next.bind(this), false);
    }
    if (this.notify_song_half == true && bindedTimeUpdate == false){
        this.audio.addEventListener("timeupdate", _timeUpdate.bind(this), false);
    }
    this.audio.addEventListener("error", _next.bind(this), false);
    this.audio.addEventListener("play", _audioOnPlay.bind(this), false);
    this.audio.addEventListener("pause", _audioOnPause.bind(this), false);
}
function _saveLocally(){
    if (this.use_local_storage == true){
        localStorage.setItem("exPlayQueue_list", JSON.stringify(_getList()));
        localStorage.setItem("exPlayQueue_queueNumber", _queueNumber);
        localStorage.setItem("exPlayQueue_isShuffled", _isShuffled);
    }
}
function _getList(){
    return _list;
}
function _getLocalStorageList(){
    var l = localStorage.getItem("exPlayQueue_list");
    if (l){
        return JSON.parse(l);
    }
    return [];
}
function _getLocalStorageQueueNumber(){
    var n = localStorage.getItem("exPlayQueue_queueNumber");
    if (n){
        return JSON.parse(n);
    }
    return 0;
}
function _getLocalStorageIsShuffled(){
    var n = localStorage.getItem("exPlayQueue_isShuffled");
    if (n){
        return JSON.parse(n);
    }
    return false;
}
function _getSong(){
    return _list[_queueNumber] || null;
}
function _add(songs){
    var currentListLen = _getList().length;
    var added = [];
    if (typeof(songs) == "string"){
        var song = {
            "url" : songs, 
            "_listPosition" : _list.length
        }
        _list.push(song);
        added.push(song);
    }
    if (typeof(songs) == "object"){
        if(songs.length){
            var len = songs.length;
            for (var i = 0; i < len; i++){
                var song = songs[i];
                song._listPosition = _list.length;
                var newSong = _getSavedSong.apply(this, [song]);
                _list.push(newSong);
                added.push(newSong);
            }
        } else {
            songs._listPosition = _list.length;
            var newSong = _getSavedSong.apply(this, [songs]);
            _list.push(newSong);
            added.push(newSong);
        }
    }
    var newList = _getList();
    _dispatchListChanged(newList, _queueNumber, added, [], currentListLen, currentListLen, newList.length);
}
function _getSavedSong(song){
    var newSong = {};
    for (var prop in this.savedSongProperties){
        newSong[this.savedSongProperties[prop]] = song[this.savedSongProperties[prop]];
    }
    return newSong;
}
function _remove(n){
    var currentListLen = _getList().length;
    var returnValue = -1;
    if(_list[n]){
        var removed = _list.splice(n, 1);
        if (_queueNumber == n){
            if (!this.audio.paused){
                _queueNumber--;
                _next.apply(this, [true]);
            }
        }
        if (_queueNumber > n){
            _queueNumber--;
        }
        var len = _list.length;
        _updateListPositions.apply(this, [removed[0]._listPosition]);
        var newList = _getList();
        _dispatchListChanged(newList, _queueNumber, [], removed, null, currentListLen, newList.length);
        returnValue = n;
    }
    return returnValue;
}
function _clear(){
    var removed = _list.concat([]);
    _list = [];
    _queueNumber = 0;
    this.setShuffled(false);
    this.stop();
    _dispatchListChanged([], _queueNumber, [], removed, null, 0, 0);
}
function _move(itemIndex, moveToIndex){
    if (itemIndex == moveToIndex){
        throw new TypeError("Cannot move item into it's own position");
    } 
    var len = _getList().length - 1;
    if (len < itemIndex){
        throw new TypeError("itemIndex out of bounds");
    }
    if (len < moveToIndex){
        throw new TypeError("moveToIndex out of bounds");
    }
    var song = _list.splice(itemIndex, 1);
    _list.splice(moveToIndex, 0, song[0]);
    if (!_isShuffled){
        _updateListPositions.apply(this);
    }
    if (_queueNumber == itemIndex){
        _queueNumber = moveToIndex;
    } else {
        if (itemIndex < _queueNumber && moveToIndex >= _queueNumber){
            _queueNumber--;
        }
        if (itemIndex > _queueNumber && moveToIndex <= _queueNumber){
            _queueNumber++;
        }
    }
    var newList = _getList();
    _dispatchListChanged(newList, _queueNumber, [], [], null, newList.length, newList.length);
}
function _updateListPositions(n){
    var len = _list.length;
    if (len > 0){
        if (!this.isShuffled()){
            for (var i = 0; i < len; i++){
                var song = _list[i];
                song._listPosition = i;
            }
        } else {
            for (var i = 0; i < len; i++){
                var song = _list[i];
                if (song._listPosition > n){
                    song._listPosition--;
                }
            }
        }
    }
}
function _play(n){
    if (_list[n]){
        clearTimeout(_loadTimeout);
        _isStopped = false;
        _song_half_notified = false;
        _queueNumber = n;
        _song = _getSong();
        _dispatchEvent("loading", 
            {
                'song': _song, 
                'queueNumber': _queueNumber, 
                'audio': this.getAudioProperties()
            }
        );
        var url = _song.url;
        if (this.soundcloud_key != null){
            if (url.indexOf("soundcloud.com") != -1){
                if (url.indexOf("?") == -1){
                    url = url+"?consumer_key="+this.soundcloud_key;
                } else {
                    url = url+"&consumer_key="+this.soundcloud_key;
                }
            }
        }
        this.audio.src = url;
        this.audio.load();
        if (this.load_timeout != -1){
            _loadTimeout = setTimeout(_timeoutLoading.bind(this), this.load_timeout);
        }
        if (this.use_local_storage == true){
            localStorage.setItem("exPlayQueue_queueNumber", _queueNumber);
        }
        if (this.length_cap != -1){
            if (_list.length > this.length_cap){
                var cutNumber = _list.length - this.length_cap;
                if (_queueNumber < cutNumber){
                    cutNumber = _queueNumber - 1;
                }
                _queueNumber -= cutNumber;
                var currentListLen = _list.length; 
                var removed = _list.splice(0, cutNumber);
                _updateListPositions.apply(this, [0]);
                _dispatchListChanged(_list, _queueNumber, [], removed, null, currentListLen, _list.length);
            }
        }
    } else {
        throw new TypeError("Index out of bounds. Got: "+n+" Length: "+_list.length);
    }
}
function _playPause(){
    if (_isStopped){
        if (_list[_queueNumber]){
            this.play(_queueNumber);
        }
    } else {
        if (this.audio.paused){
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }
}
function _canPlay(){
    this.audio.play();
    _dispatchEvent("playing", 
        {
            'song': _getSong(), 
            'queueNumber': _queueNumber,  
            'audio': this.getAudioProperties()
        }
    );
}
function _timeUpdate(){
    if (this.notify_before_end == true && this.audio.duration > 0 && this.audio.duration - this.audio.currentTime < .5){
        _next.apply(this);
    }
    if (this.notify_song_half == true && _song_half_notified == false && this.audio.currentTime / this.audio.duration > .5){
        _song_half_notified = true;
        _dispatchEvent("songHalf", 
            {
                'song': _getSong(), 
                'queueNumber': _queueNumber
            }
        );
    }
}
function _timeoutLoading(){
    if (this.audio.paused == false){
        if (this.audio.currentTime < 1){
            this.next();
        }
    }
}
function _next(e){
    if (_queueNumber < _list.length - 1){
        _queueNumber++;
        this.play(_queueNumber);
        _dispatchEvent("nextTrack", 
            {
                'song': _getSong(), 
                'queueNumber': _queueNumber
            }
        );
    } else {
        if (typeof(e) != "undefined"){
            this.stop();
        } 
    }
}
function _previous(){
    if (this.smart_previous == true){
        if (this.audio.currentTime > 10){
            this.play(_queueNumber);
        } else {
            if (_queueNumber > 0){
                _queueNumber--;
                this.play(_queueNumber);
                _dispatchEvent("previousTrack", 
                    {
                        'song': _getSong(), 
                        'queueNumber': _queueNumber
                    }
                );
            }
        }
    } else {
        if (_queueNumber > 0){
            _queueNumber--;
            this.play(_queueNumber);
            _dispatchEvent("previousTrack", 
                {
                    'song': _getSong(), 
                    'queueNumber': _queueNumber
                }
            );
        }
    }
}
function _stop(){
    _isStopped = true;
    _queueNumber = 0;
    /*
try {
        this.audio.pause();
        this.audio.src = "";
        this.audio.currentTime = 0;
    } catch(e){}
*/
    _dispatchEvent("stop", 
        {
            'audio': this.getAudioProperties()
        }
    );
}
function _setShuffled(b, start){
    if (typeof(b) == "boolean"){
        if (b == true){
            if(_isShuffled == false){
                _shuffleList.apply(this, [start]);
            }
        } else {
            if(_isShuffled == true){
                _unShuffleList.apply(this, [start]);
            }
        }
    } else {
        throw new TypeError("setShuffled only accepts booleans");
    }
}
function _toggleShuffle(start){
    if (_isShuffled == true){
        _unShuffleList.apply(this, [start]);
    } else {
        _shuffleList.apply(this, [start]);
    }
    return _isShuffled;
}
function _shuffleList(start){
    var len = _list.length;
    if (len > 0){
        var playingSongPosition = _list[_queueNumber]._listPosition;
        start = start || 0;
        var toShuffle = _list.splice(start, _list.length - start);  
        _shuffle(toShuffle);
        var first = _list.splice(0, start);
        var newList = first.concat(toShuffle);
        for (var i = 0; i < len; i++){
            var song = newList[i];
            if (song._listPosition == playingSongPosition){
                newList.splice(i, 1);
                newList.splice(start, 0, song);
            }
        }
        _list = newList.concat([]);
        _queueNumber = start;
    }
    _isShuffled = true;
    _dispatchListChanged(_list, _queueNumber, [], [], null, _list.length, _list.length);
    _dispatchEvent("shuffleToggled", 
        {
            'queueNumber': _queueNumber, 
            'isShuffled': _isShuffled, 
            'list': _list,
            'shuffledPart': toShuffle
        }
    );
}
function _unShuffleList(){
    var len = _list.length;
    if (len > 0){
        var newList = [];
        for (var i = 0; i < len; i++){
            var song = _list[i];
            newList[song._listPosition] = song;
        }
        _queueNumber = _getSong()._listPosition;
        _list = newList.concat([]);
    }
    _isShuffled = false;
    _dispatchListChanged(_list, _queueNumber, [], [], null, _list.length, _list.length);
    _dispatchEvent("shuffleToggled", 
        {
            'queueNumber': _queueNumber, 
            'isShuffled': _isShuffled, 
            'list': _list, 
            'shuffledPart': []
        }
    );
}
function _shuffle(o){
    //+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
function _getAudioProperties(){
    return {
        "paused" : this.audio.paused,
        "isStopped" : _isStopped,
        "currentTime" : this.audio.currentTime,
        "duration" : this.audio.duration,
        "src" : this.audio.src,
        "volume" : this.audio.volume,
        "queueNumber": _queueNumber,
        'song': this.getSong()
    }
}
function _refreshList(){
    var newList = _getList();
    _dispatchListChanged(newList, _queueNumber, [], [], null, newList.length, newList.length);
}
function _audioOnPlay(e){
    _dispatchEvent("play", 
        {
            'song': _getSong.apply(this), 
            'audio': _getAudioProperties.apply(this), 
            'queueNumber': _queueNumber
        }
    );
}
function _audioOnPause(e){
    _dispatchEvent("pause", 
        {
            'song': _getSong.apply(this), 
            'audio': _getAudioProperties.apply(this), 
            'queueNumber': _queueNumber
        }
    );
}
function _getSongAt(position){
    return _list[position];
}
function _seek(percentage){
    if (!isNaN(this.audio.duration)){
        this.audio.currentTime = Math.floor(percentage * this.audio.duration);
    }
}
function _dispatchListChanged(list, queueNumber, added, removed, positionAddedAt, oldListLength, newListLength){
    _dispatchEvent("listChanged", 
        {
            'list': list, 
            'queueNumber': _queueNumber, 
            'added': added,
            'removed': removed,
            'positionAddedAt': positionAddedAt, 
            'oldListLength': oldListLength, 
            'newListLength': newListLength,
            'isShuffled': _isShuffled
        }
    );
}
function _onStorageChange(e){
    if (e.key == 'exPlayQueue_list'){
        var list = JSON.parse(e.newValue);
    }
    if (e.key == 'exPlayQueue_queueNumber'){
        
    }
}
function _addEventListener(eventName, callback, b){
    for (var i in _listeners){
		if (eventName == i){
			_listeners[i].push(callback);
			break;
		};
	};
};
function _removeEventListener(type, fn){
	if (typeof _listeners[type] != 'undefined') {
		for (var i = 0, l; l = _listeners[type][i]; i++) {
	    	if (l == fn) break;
	    }
	_listeners[type].splice(i, 1);
	}
};
function _dispatchEvent(type, object){
	if (typeof _listeners[type] != 'undefined' && _listeners[type].length) {
		var array = _listeners[type].slice();
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

    }

    if(typeof module !== "undefined"){
        module.exports = PlayQueue;
    }
    else{
        window.PlayQueue = PlayQueue;
    }
}());