import {EventBus} from './event-bus.js';
import {AudioManager} from './audio-manager.js';

class ListManager {
  
  constructor() {
    if (!ListManager.instance) {
      ListManager.instance = this;
    }
    return ListManager.instance;
  }
  
  get eventBus() {
    if (!this._eventBus) {
      this._eventBus = new EventBus(); 
    }
    return this._eventBus;
  }
  
  get audioManager() {
    if (!this._audioManager) {
      this._audioManager = new AudioManager(); 
    }
    return this._audioManager;
  }
  
  initFromLocalStorage() {
    const lsList = localStorage.getItem(`${this.localStorageNS}:list`);
    if (lsList !== null) {
      this._list = JSON.parse(lsList);
    }
    const lsPosition = localStorage.getItem(`${this.localStorageNS}:position`);
    if (lsPosition !== null) {
      this._position = JSON.parse(lsPosition);
    }
    const lsShuffle = localStorage.getItem(`${this.localStorageNS}:shuffle`);
    if (lsShuffle !== null) {
      this._shuffle = JSON.parse(lsShuffle);
    }
    this._useLocalStorage = true;
  }
  
  get list() {
    if (this._list === undefined) {
      this._list = [];
    }
    return this._list;
  }
  
  set list(array) {
    const currentList = [].concat(this.list);
    let removed = [];
    let added = [];
    let positionAddedAt = null;
    if (array.length > 0) {
      if (this.limit > -1 && array.length > this.limit) {
        throw new RangeError(`
          List has ${this.length} songs. 
          Adding ${array.length} songs will go over limit (${this.limit})
        `);
      } else {
        positionAddedAt = currentList.length;
        added = [].concat(array);
        this.addOriginalIndexToSong(added);
        if (this.shuffle === true) {
          this._list = this.shuffleArray(array);
        } else {
          this._list = array;
        }
      }
    } else {
      this._list = array;
      removed = currentList;
      this.position = 0;
      this.audioManager.stop();
    }
    this.listHasChanged(added, removed, positionAddedAt, currentList.length);
  }
  
  get length() {
    return this.list.length;
  }
  
  get position() {
    return this._position || 0; 
  }
  
  set position(num) {
    if (num >= 0) {
      if (this.length > 0) {
        if (num <= this.length - 1) {
          this._setPosition(num); 
        } else {
          throw new RangeError(`Index out of bounds`);
        }
      } else {
        if (num === 0) {
          this._setPosition(num);
        } else {
          throw new RangeError(`Index out of bounds`);
        }
      }
    } else {
      throw new RangeError(`Index out of bounds`);
    }
  }
  
  _setPosition(num) {
    this._position = num;
    if (this.useLocalStorage === true) {
      localStorage.setItem(`${this.localStorageNS}:position`, num);
    } 
  }
  
  get limit() {
    if (this._limit === undefined) {
      return -1;
    }
    return this._limit; 
  }
  
  set limit(num) {
    this._limit = num;
  }
  
  get song() {
    if (this.list[this.position]) {
      return this.list[this.position];
    } 
    return null;
  }
  
  get smartPrevious() {
    if (this._smartPrevious !== undefined) {
      return this._smartPrevious;
    }
    return true; 
  };
  
  set smartPrevious(bool) {
    this._smartPrevious = bool; 
  };
  
  get autoNext() {
    if (this._autoNext !== undefined) {
      return this._autoNext;
    }
    return true; 
  };
  
  set autoNext(bool) {
    this._autoNext = bool; 
  };
  
  get userCanStop() {
    return this._userCanStop || false; 
  };
  
  set userCanStop(bool) {
    this._userCanStop = bool; 
  };
  
  get useLocalStorage() {
    return this._useLocalStorage || false; 
  };
  
  set useLocalStorage(bool) {
    const currentState = this.useLocalStorage;
    this._useLocalStorage = bool;
    if (currentState === false && bool === true) {
      //todo dont need to save after initital load
      localStorage.setItem(`${this.localStorageNS}:list`, JSON.stringify(this.list));
      localStorage.setItem(`${this.localStorageNS}:position`, JSON.stringify(this.position));
      localStorage.setItem(`${this.localStorageNS}:shuffle`, JSON.stringify(this.shuffle));
    }
    if (bool === false) {
      localStorage.removeItem(`${this.localStorageNS}:list`);
      localStorage.removeItem(`${this.localStorageNS}:position`);
      localStorage.removeItem(`${this.localStorageNS}:shuffle`);
    }
  };
  
  get shuffle() {
    return this._shuffle || false; 
  };
  
  set shuffle(bool) {
    const currentState = this.shuffle;
    this._shuffle = bool; 
    if (bool === true) {
      this.shuffleList();
    } else {
      this.unShuffleList();
    }
    if (bool !== currentState) {
      this.eventBus.trigger('shuffleToggled', {'shuffle': bool});
    }
    if (this.useLocalStorage === true) {
      localStorage.setItem(`${this.localStorageNS}:shuffle`, JSON.stringify(bool));
    }
    if (this.length > 0) {
      this.listHasChanged([], [], null, this.length);
    }
  };
  
  get localStorageNS() {
    if (this._localStorageNS !== undefined) {
      return this._localStorageNS;
    }
    return 'playqueue';
  };
  
  set localStorageNS(str) {
    if (str !== this.localStorageNS) {
      const lsList = localStorage.getItem(`${this.localStorageNS}:list`);
      const lsPosition = localStorage.getItem(`${this.localStorageNS}:position`);
      const lsShuffle = localStorage.getItem(`${this.localStorageNS}:shuffle`);      
      if (lsList !== null) {
        localStorage.removeItem(`${this.localStorageNS}:list`);
        localStorage.setItem(`${str}:list`, lsList);
      }
      if (lsPosition !== null) {
        localStorage.removeItem(`${this.localStorageNS}:position`);
        localStorage.setItem(`${str}:position`, lsPosition);
      }
      if (lsShuffle !== null) {
        localStorage.removeItem(`${this.localStorageNS}:shuffle`);
        localStorage.setItem(`${str}:shuffle`, lsShuffle);
      }
      this._localStorageNS = str; 
    }
  };
  
  get originalIndex() {
    if (this._originalIndex === undefined) {
      this._originalIndex = 0
    } else {
      this._originalIndex = this._originalIndex + 1;
    }
    return this._originalIndex;
  }
  
  addOriginalIndexToSong(songs) {
    songs.forEach(item => {
      item._originalIndex = this.originalIndex;
    });
  }
  
  // add songs to the list. Takes an array of objects,
  // a single object or a single url string
  add(songs) {
    const currentListLen = this.length;
    let added = [];
    if (typeof songs === 'object') {
      if (songs.length) {
        songs.forEach(song => {
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
      added.push({'url': songs});
    }
    if (this.limit > -1 && currentListLen + added.length > this.limit) {
      throw new RangeError(`
        List has ${this.length} songs. 
        Adding ${added.length} songs will go over limit (${this.limit})
      `);
    } else {
      this.addOriginalIndexToSong(added);
      if (this.shuffle === true) {
        const remainingPart = this.list.splice(this.position + 1);
        const shuffledPart = this.shuffleArray(remainingPart.concat(added));
        shuffledPart.forEach(item => {
          this.list.push(item);
        });
      } else {
        added.forEach(item => {
          this.list.push(item);
        });
      }
      this.listHasChanged(added, [], currentListLen, currentListLen);
    }
  }
  
  // remove a song from the list by index
  remove(n) {
    const currentListLen = this.length;
    let returnValue = -1;
    if (this.list[n]) {
      if (this.position === n) {
        if (this.audioManager.isStopped === false) {
          this.next(true);
        }
      }
      if (this.position >= n && n !== 0) {
        this.position = this.position - 1;
      }
      const removed = this.list.splice(n, 1);
      this.listHasChanged([], removed, null, currentListLen);
      returnValue = n;
    }
    return returnValue;
  }
  
  // clear the list, reset position
  clear() {
    if (this.length > 0) {
      this.list = [];
    }
    this.position = 0;
  }
  
  // move a song from one position in the list to another
  move(itemIndex, moveToIndex) {
    if (itemIndex === moveToIndex){
      throw new RangeError(`itemIndex cannot be equal to moveIndex`);
    } 
    if (itemIndex < 0) {
      throw new RangeError('itemIndex out of bounds');
    }
    if (moveToIndex < 0) {
      throw new RangeError('moveToIndex out of bounds');
    }
    if (this.length - 1 < itemIndex) {
      throw new RangeError('itemIndex out of bounds');
    }
    if (this.length - 1 < moveToIndex) {
      throw new TypeError('moveToIndex out of bounds');
    }
    const song = this.list.splice(itemIndex, 1);
    this.list.splice(moveToIndex, 0, song[0]);
    if (this.position === itemIndex) {
      this.position = moveToIndex;
    } else if (itemIndex <  this.position && moveToIndex >=  this.position) {
      this.position = this.position - 1;
    } else if (itemIndex > this.position && moveToIndex <= this.position) {
      this.position = this.position + 1;
    }
    listHasChanged([], [], null, this.length);
  }
  
  shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  
  shuffleList() {
    const before = this.list.splice(0, this.position);
    const currentSong = this.list.splice(0, 1);
    const after = this.list.splice(0);
    this.shuffleArray(before);
    this.shuffleArray(after);
    before.forEach(item => {
      this.list.push(item);
    });
    currentSong.forEach(item => {
      this.list.push(item);
    });
    after.forEach(item => {
      this.list.push(item);
    });
  }
  
  unShuffleList() {
    this.list.sort((a, b) => a._originalIndex - b._originalIndex);
  }
  
  // Toggled shuffle state
  toggleShuffle(start) {
    if (this.shuffle === true) {
      this.shuffle = false;
    } else {
      this.shuffle = true;
    }
    return this.shuffle;
}
  
  listHasChanged(added, removed, positionAddedAt, oldListLength) {
    const frozenList = JSON.parse(JSON.stringify(this.list));
    this.eventBus.trigger('listChange', {
      'list': frozenList, 
      'length': frozenList.length,
      'position': this.position, 
      'added': added,
      'removed': removed,
      'positionAddedAt': positionAddedAt, 
      'oldListLength': oldListLength, 
      'shuffle': this.shuffle
    });
    if (this.useLocalStorage === true) {
      localStorage.setItem(`${this.localStorageNS}:list`, JSON.stringify(this.list));
    }
  }
  
}

export {ListManager};

 /**
 * @event PlayQueue~listChange
 * @description Fires when any change to the list is made.
 * @type {object}
 * @property {array} list - The full list.
 * @property {number} length - Current length of the list.
 * @property {number} position - The current position.
 * @property {array} added - Any new songs added to the list.
 * @property {array} removed - Any new songs removed from the list.
 * @property {number} positionAddedAt - If new songs where added, the position they were added at.
 * @property {number} oldListLength - The list length before any changes were made.
 * @property {boolean} shuffle - Current shuffle state.
 */
 
 /**
 * @event PlayQueue~shuffleToggled
 * @description Fires when the shuffle state changes.
 * @property {boolean} shuffle - Current shuffle state.
 */