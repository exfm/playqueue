import {ListManager} from './list-manager.js';
import {AudioManager} from './audio-manager.js';
import {EventBus} from './event-bus.js';

class PlayQueue {
  
  //todo - add back externalHelpers to rollupconfig
  
  /**
   * Create a PlayQueue
   * @class PlayQueue
   * @param {Object} opts
   * @param {string} opts.audio - The underlying audio object.
   * @param {number} [opts.limit=-1] - If set will limit the max length of the list.
   * 
   * @example 
   * import {PlayQueue} from 'playqueue'; 
   *
   * const audio = new Audio();
   *
   * const playQueue = new PlayQueue({
   *   'audio': audio
   * });
   */
  constructor(opts) {
    
    if (opts) {
      if (opts.audio) {
        this.audio = opts.audio;
        this.setOpts(opts);
      } else {
        throw new Error("PlayQueue constructor requires an Audio object");
      }
    } else {
      throw new Error("PlayQueue constructor requires an Audio object");
    }
    
    //todo - enforce types when using setters. Throw TypeError
    
    //todo - what is this?
    /*
    // should we first check the connection type
    // before setting the timeout time?
    // for Cordova only
    this.checkConnection = false;*/
    
    
    // todo - where does this go?
    /* 
    // Which song properties do we need?
    var savedSongProperties = ['url', '_listPosition'];
    this.savedSongProperties = opts.savedSongProperties || savedSongProperties;
    if(_.indexOf(this.savedSongProperties, '_listPosition') === -1){
        this.savedSongProperties.push('_listPosition');
    }*/
    
    
    
    // todo - need to figure out first load
    
    /*
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
    }*/
    
    
    
    
    //todo may or may not need this
    
    /*this.addEventListener(
        "listChanged", 
        this.saveLocally.bind(this), 
        false
    );*/
    
  }
  
  setOpts(opts) {
    const settableOpts = [
      'notifyBeforeEnd', 'notifySongHalf', 'loadTimeout',
      'limit'
    ];
    settableOpts.forEach(settableOpt => {
      if (opts[settableOpt] !== undefined) {
        this[settableOpt] = opts[settableOpt];
      }
    });
  }
  
  get listManager() {
    if (!this._listManager) {
      this._listManager = new ListManager(); 
    }
    return this._listManager;
  }
  
  get audioManager() {
    if (!this._audioManager) {
      this._audioManager = new AudioManager(); 
    }
    return this._audioManager;
  }
  
  get eventBus() {
    if (!this._eventBus) {
      this._eventBus = new EventBus(); 
    }
    return this._eventBus;
  }
  
  // List Manager
  
  
  //todo define Song. Add and link to add, remove methods
  /**
   * Get or set the list of songs. If set, the entire list will be replaced. Use add or remove to manipulate
   * the list without replacing the whole list.
   * @member
   * @type {Song[]}
   */
  get list() {
    return this.listManager.list; 
  }
  
  set list(array) {
    this.listManager.list = array; 
  }
  
  /**
   * Length of list.
   * @member
   * @type {number}
   * @readonly
   */
  get length() {
    return this.list.length;
  }
  
  /**
   * Add one or more Songs to the list.
   * @method
   * @param {(Song|Song[]|string)} params - Song object or array. If string, pass in url of the song.
   * @throws {RangeError} Added songs cannot exceed limit if set.
   * @example // add multiple songs
   * playQueue.add([
   *   {'url': '1.mp3', 'title': 'One', 'artist': 'Cool Band', 'album': 'The Hits'},
   *   {'url': '2.mp3', 'title': 'Two', 'artist': 'Cool Band', 'album': 'The Hits'}
   * ]);
   * @example // add a single song
   * playQueue.add({'url': '1.mp3', 'title': 'One', 'artist': 'Cool Band', 'album': 'The Hits'});
   * @example // add a single song with just a url
   * playQueue.add('1.mp3');
   */
  add(songs) {
    this.listManager.add(songs);
  }
  
  /**
   * Remove a Song from the list by index number.
   * @method
   * @param {number} index - The index number
   * @returns {number} The index removed or -1 if no song was found at that index.
   */
  remove(index) {
    return this.listManager.remove(index);
  }
  
  /**
   * Clear the list and resets queueNumber to 0.
   * @method
   * @param {number} index - The index number
   * @returns {number} The index removed or -1 if no song was found at that index.
   */
  clear() {
    this.listManager.clear();
  }
  
  /**
   * Current playing song.
   * @member
   * @type {(Song|null)}
   * @readonly
   */
  get song() {
    return this.listManager.song;
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
   * client goes offline so it doesn't skip through all songs.
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
   * If set will limit the max length of the list. -1 means no limit.
   * @member
   * @type {number} 
   * @default -1
   */
  get limit() {
    return this.listManager.limit; 
  } 
  
  set limit(num) {
    this.listManager.limit = num; 
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
  
    
  
  // Audio Manager
  
  //todo can make this an object or selector
  /**
   * The underlying audio object.  
   * @member
   * @type {Audio}
   */
  get audio() {
    return this.audioManager.audio;
  }
  
  set audio(_audio) {
    this.audioManager.audio = _audio;
  }
  
  //todo - change to shouldNotifyBeforeEnd
  /**
   * If true, will trigger 'ended' event manually when there is .1s remaining in song. 
   * Fix for mobile Safari which doesn't always fire 'ended' event when song ends. 
   * @member
   * @type {boolean}
   * @default false
   */
  get notifyBeforeEnd() {
    return this.audioManager.notifyBeforeEnd;
  }
  
  set notifyBeforeEnd(bool) {
    this.audioManager.notifyBeforeEnd = bool;
  }
  
  /**
   * Number of milliseconds waited before deciding the current song loading is not going to load 
   * and will skip to next song
   * @member
   * @type {number}
   * @default 15000
   */
  get loadTimeout() {
    return this.audioManager.loadTimeout; 
  } 
  
  set loadTimeout(num) {
    this.audioManager.loadTimeout = num; 
  }
  
  /**
   * If true, will trigger 'songHalf' event at half point of playing song. 
   * @member
   * @type {boolean}
   * @default false
   */
  get notifySongHalf() {
    return this.audioManager.notifySongHalf; 
  } 
  
  set notifySongHalf(bool) {
    this.audioManager.notifySongHalf = bool; 
  }
  
  /**
   * If a song is playing or paused will return false.
   * @member
   * @type {boolean}
   * @default true
   * @readonly
   */
  get isStopped() {
    return this.audioManager.isStopped; 
  }
  
  //to define song object
  /**
   * If set, before loading a song, this function will be called. It must return a promise. Promise must
   * resolve with a song object (or reject).  
   * @member
   * @type {function}
   */
  get validatePlayFunction() {
    return this.audioManager.validatePlayFunction; 
  } 
  
  set validatePlayFunction(fn) {
    this.audioManager.validatePlayFunction = fn; 
  }
  
  /**
   * Play a song at a specific index.   
   * @method
   * @param {number} [index=0] - The index to play.
   * @throws {RangeError} Index must be less than list length.
   */
  play(index = 0) {
    this.playMananger.play(index); 
  }
  
  /**
   * Resume/pause the current song.  
   * @method
   */
  togglePlay() {
    this.playMananger.togglePlay(); 
  }
  
  /**
   * Pause the current song.  
   * @method
   */
  pause() {
    this.audio.pause();
  }
  
  /**
   * Resume the current song.  
   * @method
   */
  resume() {
    this.audio.resume();
  }
  
  /**
   * Various audio properties.
   * @member
   * @type {object}
   * @readonly
   */
  get audioProperties() {
    return this.audioManager.audioProperties;
  }
  
  //todo - add resume method
  
  
  // Event Bus
  
  /**
   * @method
   * @description Add an event listener. 
   * @param {string} type - The name of the event to listen on.
   * @param {function} listener - The callback function for when this event is triggered.
   */
  on(type, listener) {
    this.eventBus.on(type, listener, true);
  }
  
  /**
   * @method
   * @description Remove an event listener. 
   * @param {string} type - The name of the event to remove.
   * @param {function} [listener] - The callback function for when this event is triggered. If no listener
   * is provided, all listeners of the type will be removed.
   */
  off(type, listener) {
    this.eventBus.off(type, listener);
  }

  
}

export {PlayQueue}