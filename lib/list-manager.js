class ListManager {
  
  constructor() {
    if (!ListManager.instance) {
      ListManager.instance = this;
    }
    return ListManager.instance;
  }
  
  get list() {
    return this._list; 
  }
   
  get queueNumber() {
    return this._queueNumber || 0; 
  }
  
  set queueNumber(num) {
    this._queueNumber = num;
    // todo call play after this is changed
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
    //todo shuffle the list
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
  
  
}

export {ListManager};