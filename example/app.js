import {PlayQueue} from './../lib/index.js';

class App {
  
  constructor() {
    const audio = new Audio();
    const playQueue = new PlayQueue({
      'audio': audio
    });
    playQueue.on('listChange', obj => {
      console.log('listChange', obj);
    });
    document.querySelector('#add').addEventListener('click', e => {
      
      //playQueue.limit = 3;
/*
      playQueue.list = [
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}
      ];
*/
      playQueue.add([
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}
      ]);
      
      playQueue.queueNumber = 5;
      //playQueue.clear();
      //playQueue.remove(1);
      //playQueue.list = [];
      //playQueue.add([{'url': '3'}, {'url': '4'}]);
    });
    
    document.querySelector('#shuffle').addEventListener('change', e => {
      playQueue.shuffle = e.target.checked;
    });
  }
  
  get originalIndex() {
    if (this._originalIndex === undefined) {
      this._originalIndex = 0
    } else {
      this._originalIndex = this._originalIndex + 1;
    }
    return this._originalIndex;
  }
  
}

window.addEventListener('load', e => {
  new App();
});