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
   * Get or set the position of the current song playing. If number is changed, will immediatelly skip to 
   * that position in list.
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
  
  /**
   * If true, calling 'previous' method will start current song playing again if it is more than 10 seconds
   * in. If false, will go back to previous song in list.
   * @member
   * @type {boolean} 
   * @default true
   */
  get smartPrevious() {
    return this.listManager.smartPrevious; 
  };
  
  set smartPrevious(bool) {
    this.listManager.smartPrevious = bool; 
  };
  
  /**
   * If true, on last song in list, user can click next and it will immediatelly end song and trigger 
   * 'stop' event.
   * @member
   * @type {boolean} 
   * @default false
   */
  get userCanStop() {
    return this.listManager.userCanStop; 
  };
  
  set userCanStop(bool) {
    this.listManager.userCanStop = bool; 
  };
  
  
  /**
   * If true, we should automatically go to next song when current song ends. Good to set to false if  
   * client goes offline so itdoesn't skip through all songs.
   * @member
   * @type {boolean} 
   * @default true
   */
  get autoNext() {
    return this.listManager.autoNext; 
  } 
  
  set autoNext(bool) {
    this.listManager.autoNext = bool; 
  } 
  
  /**
   * If true, list, queueNumber, and shuffled state will be stored in localStorage and set on page load.
   * @member
   * @type {boolean} 
   * @default false
   */
  get useLocalStorage() {
    return this.listManager.useLocalStorage; 
  } 
  
  set useLocalStorage(bool) {
    this.listManager.useLocalStorage = bool; 
  }
  
  /**
   * If set will limit the max length of the list. -1 means no cap.
   * @member
   * @type {number} 
   * @default -1
   */
  get lengthCap() {
    return this.listManager.lengthCap; 
  } 
  
  set lengthCap(num) {
    this.listManager.lengthCap = num; 
  }
  
  /**
   * If set to true, will shuffle the current list. Setting back to false will revert to original list order.
   * @member
   * @type {boolean} 
   * @default false
   */
  get shuffle() {
    return this.listManager.shuffle; 
  }
  
  set shuffle(bool) {
    this.listManager.shuffle = bool; 
  }
  
  /**
   * Namespace for localStorage items. Items will be saved like 'namespace:itemName'
   * @member
   * @type {string} 
   * @default 'playqueue'
   */
  get localStorageNS() {
    return this.listManager.localStorageNS; 
  }
  
  set localStorageNS(str) {
    this.listManager.localStorageNS = str; 
  }
  
    
  
  // Audio
  
  /**
   * If true, will trigger 'ended' event manually when there is .1s remaining in song. 
   * Fix for mobile Safari which doesn't always fire 'ended' event when song ends. 
   * @member
   * @type {boolean}
   * @default false
   */
  get notifyBeforeEnd() {
    return this.audioManger.notifyBeforeEnd;
  }
  
  set notifyBeforeEnd(bool) {
    this.audioManger.notifyBeforeEnd = bool;
  }
  
  /**
   * Number of milliseconds waited before deciding the current song loading is not going to load 
   * and will skip to next song
   * @member
   * @type {number}
   * @default 15000
   */
  get loadTimeout() {
    return this.audioManger.loadTimeout; 
  } 
  
  set loadTimeout(num) {
    this.audioManger.loadTimeout = num; 
  }
  
  /**
   * If true, will trigger 'songHalf' event at half point of playing song. 
   * @member
   * @type {boolean}
   * @default false
   */
  get notifySongHalf() {
    return this.audioManger.notifySongHalf; 
  } 
  
  set notifySongHalf(bool) {
    this.audioManger.notifySongHalf = bool; 
  }
  
  /**
   * If a song is playing or paused will return false.
   * @member
   * @type {boolean}
   * @default true
   * @readonly
   */
  get isStopped() {
    return this.audioManger.isStopped; 
  }
  
  //to define song object
  /**
   * If set, before loading a song, this function will be called. It must return a promise. Promise must
   * resolve with a song object (or reject).  
   * @member
   * @type {function}
   */
  get validatePlayFunction() {
    return this.audioManger.validatePlayFunction; 
  } 
  
  set validatePlayFunction(fn) {
    this.audioManger.validatePlayFunction = fn; 
  }
  

  
}

export {PlayQueue}