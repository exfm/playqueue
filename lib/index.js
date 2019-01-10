import {ListManager} from './list-manager.js';
import {AudioManager} from './audio-manager.js';

class PlayQueue {
  
  /**
   * Create a PlayQueue
   * @class PlayQueue
   * @param {Object} params
   * @param {string} params.selector - Parent element of view. Also the default element when a selector 
   *  is not passed in to methods. Must be a valid CSS selector string.
   * 
   */
  constructor(opts) {
    
    
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
    
    // if not null, this func must return a promise
    // the promise must return a song object
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
        'error': [],
        'preloading': []
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
  
  get listManager() {
    if (!this.listManager) {
      this.listManager = new ListManager(); 
    }
    return this.listManager;
  }
  
  get audioManager() {
    if (!this.audioManager) {
      this.audioManager = new AudioManager(); 
    }
    return this.audioManager;
  }
  
  // List
  
  /**
   * The main list of songs.
   * @member
   * @type {array}
   */
  get list() {
    return this.listManager.list; 
  }
  
  /**
   * Get or set the position of the current song playing [number].
   * @member
   * @type {number}
   * @category List
   */ 
  get queueNumber() {
    return this.listManager.queueNumber; 
  }
  
  set queueNumber(num) {
    this.listManager.queueNumber = num;
  }
  
  // Audio
  
  /**
   * Get or set if we should fire 'ended' event manually. Mobile safari doesn't always fire 'ended' 
   *  event. This will look at the time and fire it manually when it's .1 to end. [boolean].
   * @member
   * @type {boolean}
   */
  get notifyBeforeEnd() {
    return this.audioManger.notifyBeforeEnd;
  }
  
}

export {PlayQueue}