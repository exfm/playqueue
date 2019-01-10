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
  
  get list() {
    if (this._list !== undefined) {
      return this._list;
    } 
    return [];
  }
  
  set list(array) {
    const currentList = [].concat(this.list);
    let removed = [];
    let added = [];
    let positionAddedAt = null;
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
    this.triggerListChange(added, removed, positionAddedAt, currentList.length);
  }
  
  get length() {
    return this.list.length;
  }
  
  //todo consider changing this to position
  get queueNumber() {
    return this._queueNumber || 0; 
  }
  
  set queueNumber(num) {
    this._queueNumber = num;
    // todo call play after this is changed
    // todo set local storage is needed
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
    this._useLocalStorage = bool;
    //todo save current list to local storage 
  };
  
  get shuffle() {
    return this._shuffle || false; 
  };
  
  set shuffle(bool) {
    this._shuffle = bool; 
    // todo shuffle the list
    // todo set local storage is needed
  };
  
  get localStorageNS() {
    if (this._localStorageNS !== undefined) {
      return this._localStorageNS;
    }
    return 'playqueue';
  };
  
  set localStorageNS(str) {
    this._localStorageNS = str; 
  };
  
  
  // Save the list, queueNumber and shuffled state to localStorage
  saveToLS() {
    if (this.useLocalStorage === true) {
      localStorage.setItem(`${localStorageNS}:list`, this.list);
      localStorage.setItem(`${localStorageNS}:queueNumber`, this.queueNumber);
      localStorage.setItem(`${localStorageNS}:shuffle`, this.shuffle);
    }
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
    added.forEach((item, i) => {
      item._listPosition = currentListLen + i;
    });
    if (this.shuffle === true) {
      const firstPart = this.list.slice(0, this.queueNumber + 1);
      const remainingPart = this.list.slice(queueNumber + 1); 
      const shuffledPart = this.shuffleArray(remainingPart.concat(added));
      this.list = firstPart.concat(shuffledPart);
    } else {
      this.list = this.list.concat(added);
    }
    //this.triggerListChange(added, [], currentListLen, currentListLen);
  }
  
  // remove a song from the list by index
  remove(n) {
    const currentListLen = this.length;
    let returnValue = -1;
    if (this.list[n]) {
      if (this.queueNumber === n) {
        if (this.audioManager.isStopped === false) {
          this.next(true);
        }
      }
      if (this.queueNumber >= n && n !== 0) {
        this.queueNumber = this.queueNumber - 1;
      }
      const removed = this.list.splice(n, 1);
      this.updateListPositions(removed[0]._listPosition);
      this.triggerListChange([], removed, null, currentListLen);
      returnValue = n;
    }
    return returnValue;
  }
  
  // clear the list, reset queueNumber, shuffled
  clear() {
    this.list = [];
  }
  
  // after the list was manipulated, 
  // update the _listPosition property on each song
  updateListPositions(n = 0) {
    if (this.shuffle === false) {
      this.list.forEach((item, i) => {
        item._listPosition = i;
      });
    } else {
      this.list.forEach((item, i) => {
        if (item._listPosition > n) {
          item._listPosition--;
        }
      });   
    }
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
  
  // rename 'listHasChanged'
  triggerListChange(added, removed, positionAddedAt, oldListLength) {
    // todo set local storage is needed
    const frozenList = [].concat(this.list);
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
  
}

export {ListManager};

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