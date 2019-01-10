(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['audio-controls'] = {})));
}(this, (function (exports) { 'use strict';

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus = function () {
  function EventBus() {
    _classCallCheck$2(this, EventBus);

    if (!EventBus.instance) {
      EventBus.instance = this;
      this.listeners = {};
    }
    return EventBus.instance;
  }

  _createClass$2(EventBus, [{
    key: 'on',
    value: function on(type, listener) {
      var checkAllowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (checkAllowed === true) {
        if (this.allowedTypes[type] === true) {
          if (!this.listeners[type]) {
            this.listeners[type] = [];
          }
          this.listeners[type].push(listener);
        }
      } else {
        if (!this.listeners[type]) {
          this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
      }
    }
  }, {
    key: 'off',
    value: function off(type, listener) {
      var _this = this;

      if (typeof this.listeners[type] !== 'undefined') {
        this.listeners[type].forEach(function (l, i) {
          if (listener) {
            if (l === listener) {
              _this.listeners[type].splice(i, 1);
            }
          } else {
            _this.listeners[type] = [];
          }
        });
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, data) {
      var _this2 = this;

      if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
        var array = this.listeners[type].slice();
        array.forEach(function (listener) {
          Object.assign(data, _this2.eventExtras(type));
          listener.apply(null, [data]);
        });
      }
    }

    //todo add in extra props (song, etc)

  }, {
    key: 'eventExtras',
    value: function eventExtras(type) {
      return {
        'type': type,
        'timestamp': new Date().getTime()
      };
    }
  }, {
    key: 'allowedTypes',
    get: function get() {
      return {
        'nextTrack': true,
        'previousTrack': true,
        'added': true,
        'playing': true,
        'songHalf': true,
        'loading': true,
        'stop': true,
        'shuffleToggle': true,
        'listChange': true,
        'play': true,
        'pause': true,
        'error': true,
        'preloading': true
      };
    }
  }]);

  return EventBus;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioManager = function () {
  function AudioManager() {
    _classCallCheck$3(this, AudioManager);

    if (!AudioManager.instance) {
      AudioManager.instance = this;
    }
    return AudioManager.instance;
  }

  _createClass$3(AudioManager, [{
    key: 'addAudioListeners',


    // todo do we need removeEventListeners?
    value: function addAudioListeners() {
      var _this = this;

      if (this.audio && this.listenersAdded === false) {

        //todo where is canPlay?
        this.audio.addEventListener('canplay', this.canPlay.bind(this));

        if (this.notifyBeforeEnd === true || this.notifySongHalf === true) {
          this.audio.addEventListener('timeupdate', this.timeUpdate.bind(this));
        }

        // todo if notifyBeforeEnd becomes true later, this needs to be set
        if (this.notifyBeforeEnd === false) {
          this.audio.addEventListener('ended', function (e) {
            _this.eventBus.trigger('audio:next');
          });
        }

        this.audio.addEventListener('error', function (e) {
          _this.eventBus.trigger('audio:error');
        });

        //todo where is audioOnPlay?
        this.audio.addEventListener('play', this.audioOnPlay.bind(this));

        //todo where is audioOnPause?
        this.audio.addEventListener('pause', this.audioOnPause.bind(this));

        this.audio.addEventListener('remoteprevious', function (e) {
          _this.eventBus.trigger('audio:previous');
        });

        this.audio.addEventListener('remotenext', function (e) {
          _this.eventBus.trigger('audio:next');
        });
      }
    }
  }, {
    key: 'canPlay',
    value: function canPlay() {
      //todo
    }
  }, {
    key: 'timeUpdate',
    value: function timeUpdate() {
      //todo
    }
  }, {
    key: 'audioOnPlay',
    value: function audioOnPlay() {
      //todo
    }
  }, {
    key: 'audioOnPause',
    value: function audioOnPause() {
      //todo
    }
  }, {
    key: 'eventBus',
    get: function get() {
      if (!this._eventBus) {
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }
  }, {
    key: 'audio',
    get: function get() {
      return this._audio;
    }

    //todo set up listeners
    ,
    set: function set(_audio) {
      this._audio = _audio;
      this.addAudioListeners();
    }
  }, {
    key: 'listenersAdded',
    get: function get() {
      return this._listenersAdded || false;
    },
    set: function set(bool) {
      this._listenersAdded = bool;
    }
  }, {
    key: 'paused',
    get: function get() {
      if (this.audio !== undefined) {
        return this.audio.paused;
      }
      return false;
    }
  }, {
    key: 'notifyBeforeEnd',
    get: function get() {
      return this._notifyBeforeEnd || false;
    },
    set: function set(bool) {
      this._notifyBeforeEnd = bool;
    }

    // Boolean if we already fired the fake 'ended' event

  }, {
    key: 'beforeEndNotified',
    get: function get() {
      return this._beforeEndNotified || false;
    },
    set: function set(bool) {
      this._beforeEndNotified = bool;
    }
  }, {
    key: 'loadTimeout',
    get: function get() {
      return this._loadTimeout || 15000;
    },
    set: function set(num) {
      this._loadTimeout = num;
    }
  }, {
    key: 'notifySongHalf',
    get: function get() {
      return this._notifySongHalf || false;
    },
    set: function set(bool) {
      this._notifySongHalf = bool;
    }

    // Boolean if we already fired the song half event

  }, {
    key: 'songHalfNotified',
    get: function get() {
      return this._songHalfNotified || false;
    },
    set: function set(bool) {
      this._songHalfNotified = bool;
    }
  }, {
    key: 'isStopped',
    get: function get() {
      if (this._isStopped !== undefined) {
        return this._isStopped;
      }
      return true;
    },
    set: function set(bool) {
      this._isStopped = bool;
    }

    // todo - should this be an option or just always do it?
    // should we first check if client is online before
    // trying to load a song

    //this.checkOnlineStatus = false;

  }, {
    key: 'validatePlayFunction',
    get: function get() {
      return this._validatePlayFunction;
    },
    set: function set(fn) {
      this._validatePlayFunction = fn;
    }
  }]);

  return AudioManager;
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ListManager = function () {
  function ListManager() {
    _classCallCheck$1(this, ListManager);

    if (!ListManager.instance) {
      ListManager.instance = this;
    }
    return ListManager.instance;
  }

  _createClass$1(ListManager, [{
    key: 'saveToLS',


    // Save the list, queueNumber and shuffled state to localStorage
    value: function saveToLS() {
      if (this.useLocalStorage === true) {
        localStorage.setItem(localStorageNS + ':list', this.list);
        localStorage.setItem(localStorageNS + ':queueNumber', this.queueNumber);
        localStorage.setItem(localStorageNS + ':shuffle', this.shuffle);
      }
    }

    // add songs to the list. Takes an array of objects,
    // a single object or a single url string

  }, {
    key: 'add',
    value: function add(songs) {
      var _this = this;

      var currentListLen = this.length;
      var added = [];
      if ((typeof songs === 'undefined' ? 'undefined' : _typeof(songs)) === 'object') {
        if (songs.length) {
          songs.forEach(function (song) {
            if (song.url) {
              added.push(song);
            }
          });
        } else {
          if (songs.url) {
            added.push(songs);
          }
        }
      } else if (typeof songs === 'string') {
        added.push({ 'url': songs });
      }
      added.forEach(function (item, i) {
        item._listPosition = currentListLen + i;
      });
      if (this.shuffle === true) {
        //const firstPart = this.list.slice(0, this.queueNumber + 1);

        var remainingPart = this.list.splice(queueNumber + 1);

        //const remainingPart = this.list.slice(queueNumber + 1); 
        var shuffledPart = this.shuffleArray(remainingPart.concat(added));
        shuffledPart.forEach(function (item) {
          _this.list.push(item);
        });
        //this.list = firstPart.concat(shuffledPart);
      } else {
        added.forEach(function (item) {
          _this.list.push(item);
        });
        //this.list = this.list.concat(added);
      }
      this.listHasChanged(added, [], currentListLen, currentListLen);
    }

    // remove a song from the list by index

  }, {
    key: 'remove',
    value: function remove(n) {
      var currentListLen = this.length;
      var returnValue = -1;
      if (this.list[n]) {
        if (this.queueNumber === n) {
          if (this.audioManager.isStopped === false) {
            this.next(true);
          }
        }
        if (this.queueNumber >= n && n !== 0) {
          this.queueNumber = this.queueNumber - 1;
        }
        var removed = this.list.splice(n, 1);
        this.updateListPositions(removed[0]._listPosition);
        this.listHasChanged([], removed, null, currentListLen);
        returnValue = n;
      }
      return returnValue;
    }

    // clear the list, reset queueNumber, shuffled

  }, {
    key: 'clear',
    value: function clear() {
      this.list = [];
    }

    // after the list was manipulated, 
    // update the _listPosition property on each song
    // todo - why do we care if it is shuffled?

  }, {
    key: 'updateListPositions',
    value: function updateListPositions() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.shuffle === false) {
        this.list.forEach(function (item, i) {
          item._listPosition = i;
        });
      } else {
        this.list.forEach(function (item, i) {
          if (item._listPosition > n) {
            item._listPosition--;
          }
        });
      }
    }
  }, {
    key: 'shuffleArray',
    value: function shuffleArray(array) {
      var currentIndex = array.length,
          temporaryValue = void 0,
          randomIndex = void 0;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  }, {
    key: 'listHasChanged',
    value: function listHasChanged(added, removed, positionAddedAt, oldListLength) {
      // todo set local storage is needed
      var frozenList = [].concat(this.list);
      this.eventBus.trigger('listChange', {
        'list': frozenList,
        'length': frozenList.length,
        'queueNumber': this.queueNumber,
        'added': added,
        'removed': removed,
        'positionAddedAt': positionAddedAt,
        'oldListLength': oldListLength,
        'shuffle': this.shuffle
      });
    }
  }, {
    key: 'eventBus',
    get: function get() {
      if (!this._eventBus) {
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }
  }, {
    key: 'audioManager',
    get: function get() {
      if (!this._audioManager) {
        this._audioManager = new AudioManager();
      }
      return this._audioManager;
    }
  }, {
    key: 'list',
    get: function get() {
      if (this._list !== undefined) {
        return this._list;
      }
      return [];
    },
    set: function set(array) {
      var currentList = [].concat(this.list);
      var removed = [];
      var added = [];
      var positionAddedAt = null;
      if (array.length > 0) {
        positionAddedAt = currentList.length;
        added = [].concat(array);
        if (this.shuffle === true) {
          this._list = this.shuffleArray(array);
        } else {
          this._list = array;
        }
      } else {
        this._list = array;
        removed = currentList;
        this.queueNumber = 0;
        //todo - what is this.stop?
        //this.stop();
      }
      this.updateListPositions();
      this.listHasChanged(added, removed, positionAddedAt, currentList.length);
    }
  }, {
    key: 'length',
    get: function get() {
      return this.list.length;
    }

    //todo consider changing this to position

  }, {
    key: 'queueNumber',
    get: function get() {
      return this._queueNumber || 0;
    },
    set: function set(num) {
      this._queueNumber = num;
      // todo call play after this is changed
      // todo set local storage is needed
    }
  }, {
    key: 'smartPrevious',
    get: function get() {
      if (this._smartPrevious !== undefined) {
        return this._smartPrevious;
      }
      return true;
    },
    set: function set(bool) {
      this._smartPrevious = bool;
    }
  }, {
    key: 'autoNext',
    get: function get() {
      if (this._autoNext !== undefined) {
        return this._autoNext;
      }
      return true;
    },
    set: function set(bool) {
      this._autoNext = bool;
    }
  }, {
    key: 'userCanStop',
    get: function get() {
      return this._userCanStop || false;
    },
    set: function set(bool) {
      this._userCanStop = bool;
    }
  }, {
    key: 'useLocalStorage',
    get: function get() {
      return this._useLocalStorage || false;
    },
    set: function set(bool) {
      this._useLocalStorage = bool;
      //todo save current list to local storage 
    }
  }, {
    key: 'shuffle',
    get: function get() {
      return this._shuffle || false;
    },
    set: function set(bool) {
      this._shuffle = bool;
      // todo shuffle the list
      // todo set local storage is needed
    }
  }, {
    key: 'localStorageNS',
    get: function get() {
      if (this._localStorageNS !== undefined) {
        return this._localStorageNS;
      }
      return 'playqueue';
    },
    set: function set(str) {
      this._localStorageNS = str;
    }
  }]);

  return ListManager;
}();



/**
* @event PlayQueue~listChange
* @description Fired when any change to the list is made.
* @type {object}
* @property {array} list - The full list.
* @property {number} length - Current length of the list.
* @property {number} queueNumber - The current queueNumber.
* @property {array} added - Any new songs added to the list.
* @property {array} removed - Any new songs removed from the list.
* @property {number} positionAddedAt - If new songs where added, the position they were added at.
* @property {number} oldListLength - The list length before any changes were made.
* @property {boolean} shuffle - Current shuffle state.
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayQueue = function () {

  /**
   * Create a PlayQueue
   * @class PlayQueue
   * @param {Object} opts
   * @param {string} params.selector - Parent element of view. Also the default element when a selector 
   *  is not passed in to methods. Must be a valid CSS selector string.
   * 
   */
  function PlayQueue(opts) {
    _classCallCheck(this, PlayQueue);

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

  _createClass(PlayQueue, [{
    key: 'setOpts',
    value: function setOpts(opts) {
      var _this = this;

      var settableOpts = ['notifyBeforeEnd', 'notifySongHalf', 'loadTimeout', 'lengthCap'];
      settableOpts.forEach(function (settableOpt) {
        if (opts[settableOpt] !== undefined) {
          _this[settableOpt] = opts[settableOpt];
        }
      });
    }
  }, {
    key: 'add',


    /**
     * Add a Song to the list.
     * @method
     * @param {(Song|Song[]|string)} params - Song object or array. If string, pass in url of the song.
     */
    value: function add(songs) {
      this.listManager.add(songs);
    }

    /**
     * Remove a Song from the list by index number.
     * @method
     * @param {number} index - The index number
     * @returns {number} The index removed or -1 if no song was found at that index.
     */

  }, {
    key: 'remove',
    value: function remove(index) {
      return this.listManager.remove(index);
    }

    /**
     * Clear the list and resets queueNumber to 0.
     * @method
     * @param {number} index - The index number
     * @returns {number} The index removed or -1 if no song was found at that index.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.listManager.clear();
    }

    /**
     * Current playing song.
     * @member
     * @type {(Song|null)}
     * @readonly
     */

  }, {
    key: 'on',


    // Event Bus

    /**
     * @method
     * @description Add an event listener. 
     * @param {string} type - The name of the event to listen on.
     * @param {function} listener - The callback function for when this event is triggered.
     */
    value: function on(type, listener) {
      this.eventBus.on(type, listener, true);
    }

    /**
     * @method
     * @description Remove an event listener. 
     * @param {string} type - The name of the event to remove.
     * @param {function} [listener] - The callback function for when this event is triggered. If no listener
     * is provided, all listeners of the type will be removed.
     */

  }, {
    key: 'off',
    value: function off(type, listener) {
      this.eventBus.off(type, listener);
    }
  }, {
    key: 'listManager',
    get: function get() {
      if (!this._listManager) {
        this._listManager = new ListManager();
      }
      return this._listManager;
    }
  }, {
    key: 'audioManager',
    get: function get() {
      if (!this._audioManager) {
        this._audioManager = new AudioManager();
      }
      return this._audioManager;
    }
  }, {
    key: 'eventBus',
    get: function get() {
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

  }, {
    key: 'list',
    get: function get() {
      return this.listManager.list;
    },
    set: function set(array) {
      this.listManager.list = array;
    }

    /**
     * Length of list.
     * @member
     * @type {number}
     * @readonly
     */

  }, {
    key: 'length',
    get: function get() {
      return this.list.length;
    }
  }, {
    key: 'song',
    get: function get() {
      if (this.listManager.list) {
        return this.listManager.list[this.listManager.queueNumber];
      }
      return null;
    }

    /**
     * Get or set the position of the current song playing. If number is changed, will immediatelly skip to 
     * that position in list.
     * @member
     * @type {number}
     * @category List
     */

  }, {
    key: 'queueNumber',
    get: function get() {
      return this.listManager.queueNumber;
    },
    set: function set(num) {
      this.listManager.queueNumber = num;
    }

    /**
     * If true, calling 'previous' method will start current song playing again if it is more than 10 seconds
     * in. If false, will go back to previous song in list.
     * @member
     * @type {boolean} 
     * @default true
     */

  }, {
    key: 'smartPrevious',
    get: function get() {
      return this.listManager.smartPrevious;
    },
    set: function set(bool) {
      this.listManager.smartPrevious = bool;
    }
  }, {
    key: 'userCanStop',


    /**
     * If true, on last song in list, user can click next and it will immediatelly end song and trigger 
     * 'stop' event.
     * @member
     * @type {boolean} 
     * @default false
     */
    get: function get() {
      return this.listManager.userCanStop;
    },
    set: function set(bool) {
      this.listManager.userCanStop = bool;
    }
  }, {
    key: 'autoNext',


    /**
     * If true, we should automatically go to next song when current song ends. Good to set to false if  
     * client goes offline so itdoesn't skip through all songs.
     * @member
     * @type {boolean} 
     * @default true
     */
    get: function get() {
      return this.listManager.autoNext;
    },
    set: function set(bool) {
      this.listManager.autoNext = bool;
    }

    /**
     * If true, list, queueNumber, and shuffled state will be stored in localStorage and set on page load.
     * @member
     * @type {boolean} 
     * @default false
     */

  }, {
    key: 'useLocalStorage',
    get: function get() {
      return this.listManager.useLocalStorage;
    },
    set: function set(bool) {
      this.listManager.useLocalStorage = bool;
    }

    /**
     * If set will limit the max length of the list. -1 means no cap.
     * @member
     * @type {number} 
     * @default -1
     */

  }, {
    key: 'lengthCap',
    get: function get() {
      return this.listManager.lengthCap;
    },
    set: function set(num) {
      this.listManager.lengthCap = num;
    }

    /**
     * If set to true, will shuffle the current list. Setting back to false will revert to original list order.
     * @member
     * @type {boolean} 
     * @default false
     */

  }, {
    key: 'shuffle',
    get: function get() {
      return this.listManager.shuffle;
    },
    set: function set(bool) {
      this.listManager.shuffle = bool;
    }

    /**
     * Namespace for localStorage items. Items will be saved like 'namespace:itemName'
     * @member
     * @type {string} 
     * @default 'playqueue'
     */

  }, {
    key: 'localStorageNS',
    get: function get() {
      return this.listManager.localStorageNS;
    },
    set: function set(str) {
      this.listManager.localStorageNS = str;
    }

    // Audio Manager

    //todo can make this an object or selector
    /**
     * The underlying audio object.  
     * @member
     * @type {Audio}
     */

  }, {
    key: 'audio',
    get: function get() {
      return this.audioManager.audio;
    },
    set: function set(_audio) {
      this.audioManager.audio = _audio;
    }

    /**
     * If true, will trigger 'ended' event manually when there is .1s remaining in song. 
     * Fix for mobile Safari which doesn't always fire 'ended' event when song ends. 
     * @member
     * @type {boolean}
     * @default false
     */

  }, {
    key: 'notifyBeforeEnd',
    get: function get() {
      return this.audioManager.notifyBeforeEnd;
    },
    set: function set(bool) {
      this.audioManager.notifyBeforeEnd = bool;
    }

    /**
     * Number of milliseconds waited before deciding the current song loading is not going to load 
     * and will skip to next song
     * @member
     * @type {number}
     * @default 15000
     */

  }, {
    key: 'loadTimeout',
    get: function get() {
      return this.audioManager.loadTimeout;
    },
    set: function set(num) {
      this.audioManager.loadTimeout = num;
    }

    /**
     * If true, will trigger 'songHalf' event at half point of playing song. 
     * @member
     * @type {boolean}
     * @default false
     */

  }, {
    key: 'notifySongHalf',
    get: function get() {
      return this.audioManager.notifySongHalf;
    },
    set: function set(bool) {
      this.audioManager.notifySongHalf = bool;
    }

    /**
     * If a song is playing or paused will return false.
     * @member
     * @type {boolean}
     * @default true
     * @readonly
     */

  }, {
    key: 'isStopped',
    get: function get() {
      return this.audioManager.isStopped;
    }

    //to define song object
    /**
     * If set, before loading a song, this function will be called. It must return a promise. Promise must
     * resolve with a song object (or reject).  
     * @member
     * @type {function}
     */

  }, {
    key: 'validatePlayFunction',
    get: function get() {
      return this.audioManager.validatePlayFunction;
    },
    set: function set(fn) {
      this.audioManager.validatePlayFunction = fn;
    }
  }]);

  return PlayQueue;
}();

exports.PlayQueue = PlayQueue;

Object.defineProperty(exports, '__esModule', { value: true });

})));
