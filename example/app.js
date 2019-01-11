import {PlayQueue} from './../lib/index.js';

class App {
  
  constructor() {
    const list = document.querySelector('#list');
    const audio = new Audio();
    const playQueue = new PlayQueue({
      'audio': audio,
      'useLocalStorage': true
    });
    list.innerHTML = JSON.stringify(playQueue.list);
    console.log(playQueue.list, playQueue.queueNumber, playQueue.shuffle);
    if (playQueue.shuffle === true) {
      document.querySelector('#shuffle').setAttribute('checked', 'checked');
    }
    playQueue.on('listChange', obj => {
      console.log('listChange', obj);
      list.innerHTML = JSON.stringify(obj.list);
      
    });
    document.querySelector('#add').addEventListener('click', e => {
      playQueue.add([
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`},
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}, 
        {'url': `${this.originalIndex}`}
      ]);
      playQueue.queueNumber = 5;
    });
    
    document.querySelector('#remove').addEventListener('click', e => {
      playQueue.remove(0);
    });
    
    document.querySelector('#clear').addEventListener('click', e => {
      playQueue.clear();
    });
    
    document.querySelector('#shuffle').addEventListener('change', e => {
      playQueue.shuffle = e.target.checked;
    });
    
    document.querySelector('#ls').addEventListener('change', e => {
      playQueue.useLocalStorage = e.target.checked;
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