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
  }
  
  
}

export {ListManager};