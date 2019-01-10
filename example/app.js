import {PlayQueue} from './../lib/index.js';

class App {
  
  constructor() {
    const audio = new Audio();
    const playQueue = new PlayQueue({
      'audio': audio
    });
    document.querySelector('#play').addEventListener('click', e => {
      
      playQueue.on('listChange', obj => {
        console.log('listChange', obj);
      });
      playQueue.list = [{'url': 'example.m4a'}];
      playQueue.add([{'url': 'example.m4a'}, {'url': 'example.m4a'}]);
      //playQueue.clear();
      playQueue.remove(1);
      //playQueue.list = [];
    });
  }
  
}

window.addEventListener('load', e => {
  new App();
});