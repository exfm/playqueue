import {EventBus} from './event-bus.js';
import {ListManager} from './list-manager.js';

class AudioManager {
  
  constructor() {
    if (!AudioManager.instance) {
      AudioManager.instance = this;
    }
    return AudioManager.instance;
  }
  
  get eventBus() {
    if (!this._eventBus) {
      this._eventBus = new EventBus(); 
    }
    return this._eventBus;
  }
  
  get listManager() {
    if (!this._listManager) {
      this._listManager = new ListManager(); 
    }
    return this._listManager;
  }
  
  get audio() {
    return this._audio;
  }
  
  //todo set up listeners
  set audio(_audio) {
    this._audio = _audio;
    this.addAudioListeners();
  }
  
  get listenersAdded() {
    return this._listenersAdded || false;
  }
  
  set listenersAdded(bool) {
    this._listenersAdded = bool;
  }
  
  get paused() {
    if (this.audio !== undefined) {
      return this.audio.paused;
    }
    return false;
  }
    
  get notifyBeforeEnd() {
    return this._notifyBeforeEnd || false;
  }
  
  set notifyBeforeEnd(bool) {
    this._notifyBeforeEnd = bool;
  }
  
  // Boolean if we already fired the fake 'ended' event
  get beforeEndNotified() {
    return this._beforeEndNotified || false;
  }
  
  set beforeEndNotified(bool) {
    this._beforeEndNotified = bool;
  }
  
  get loadTimeout() {
    return this._loadTimeout || 15000; 
  } 
  
  set loadTimeout(num) {
    this._loadTimeout = num; 
  }
  
  get notifySongHalf() {
    return this._notifySongHalf || false; 
  } 
  
  set notifySongHalf(bool) {
    this._notifySongHalf = bool; 
  }
  
  // Boolean if we already fired the song half event
  get songHalfNotified() {
    return this._songHalfNotified || false;
  }
  
  set songHalfNotified(bool) {
    this._songHalfNotified = bool;
  }
  
  get isStopped() {
    if (this._isStopped !== undefined) {
      return this._isStopped;
    }
    return true;
  }
  
  set isStopped(bool) {
    this._isStopped = bool;
  }
  
  
  // todo - should this be an option or just always do it?
  // should we first check if client is online before
  // trying to load a song
  
  //this.checkOnlineStatus = false;
  
  get validatePlayFunction() {
    return this._validatePlayFunction;
  }
  
  set validatePlayFunction(fn) {
    this._validatePlayFunction = fn;
  }
  
  // todo do we need removeEventListeners?
  addAudioListeners() {
    
    if (this.audio && this.listenersAdded === false) {
    
      //todo where is canPlay?
      this.audio.addEventListener('canplay', this.canPlay.bind(this));
      
      if (this.notifyBeforeEnd === true || this.notifySongHalf === true) {
        this.audio.addEventListener('timeupdate', this.timeUpdate.bind(this));
      }
      
      // todo if notifyBeforeEnd becomes true later, this needs to be set
      if (this.notifyBeforeEnd === false) {
        this.audio.addEventListener('ended', e => {
          this.eventBus.trigger('audio:next'); 
        });
      }
      
      this.audio.addEventListener('error', e => {
        this.eventBus.trigger('audio:error'); 
      });
  
      //todo where is audioOnPlay
      this.audio.addEventListener('play', this.audioOnPlay.bind(this));
      
      //todo where is audioOnPause?
      this.audio.addEventListener('pause', this.audioOnPause.bind(this));
      
      this.audio.addEventListener('remoteprevious', e => {
        this.eventBus.trigger('audio:previous'); 
      });
      
      this.audio.addEventListener('remotenext', e => {
        this.eventBus.trigger('audio:next'); 
      });
      
    }
  }
  
  //todo why do "playing" here vs. "canplay"?
  canPlay() {
    this.canPlayCalled = true;
    this.audio.play();
    this.eventBus.trigger('playing', {
      'song': this.listManager.song,
      'audio': this.audioProperties, 
      'queueNumber': this.listManager.queueNumber
    });
  }
  
  timeUpdate() {
    //todo
  }
  
  // Trigger play event when audio play is triggered adding some useful data
  audioOnPlay(e) {
    this.eventBus.trigger('play', {
      'song': this.listManager.song,
      'audio': this.audioProperties, 
      'queueNumber': this.listManager.queueNumber
    });
  }
  
  // Trigger pause event when audio pause is triggered adding some useful data
  audioOnPause(e) {
    this.eventBus.trigger('pause', {
      'song': this.listManager.song,
      'audio': this.audioProperties, 
      'queueNumber': this.listManager.queueNumber
    });
  }
  
  // play a song at a given index
  async play(n) {
    this.canPlayCalled = false;
    const proposedSong = this.listManager.list[n];
    if (proposedSong) {
      this.eventBus.trigger('preloading', {'song': proposedSong});
      if (this.validatePlayFunction) {
        try {
          const song = await this.validatePlayFunction(proposedSong);
          this._play(song, n);
        } catch (err) {
          console.error(err);
        }      
      } else{
          this._play(proposedSong, n);
      }
    } else {
      throw new RangeError(
        `Index out of bounds. 
        Got: ${n}. List length: ${this.listManager.length}
      `);
    }
  }
  
  
  // play the song
  _play(song, n) {
    //todo - online status?
    //var shouldLoad = this.checkOnlineStatusShouldLoad(song);
    clearTimeout(this.loadTimeoutFn);
    this.isStopped = false;
    this.songHalfNotified = false;
    this.beforeEndNotified = false;
    this.listMananger.queueNumber = n;
    this.audio.src = song.url;
    this.audio.load();
    //todo document this event
    this.eventBus.trigger('loading', {
      'song': song,
      'queueNumber': this.listMananger.queueNumber,
      'audio': this.audioProperties
    });
    if (this.loadTimeout !== -1) {
      this.loadTimeoutloadTimeoutFn = setTimeout(this.timeoutLoading.bind(this), this.loadTimeout);
    }
  }
  
  // This will toggle paused state of audio. 
  // If stopped, will start playing first song
  togglePlay() {
    if (this.isStopped === true) {
      this.play(this.listMananager.queueNumber);
    } else {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }
  
  // This will pause the current audio
  pause() {
    this.audio.pause();
  }
  
  // This will resume the current audio
  resume() {
    this.audio.play();
  }
  
  // Return current audio properties plus some useful data
  //todo Object.assign({'isStopped': this.isStopped}, this.audio);
  get audioProperties() {
    return {
      'paused': this.audio.paused,
      'isStopped': this.isStopped,
      'currentTime': this.audio.currentTime,
      'duration': this.audio.duration,
      'src': this.audio.src,
      'volume': this.audio.volume
    }
  }
  
}

export {AudioManager};

/**
 * @event PlayQueue~preloading
 * @description Fired when there is a new attempt to play a song.
 * @type {object}
 * @property {Song} song - The attempted song.
 */
 
 /**
 * @event PlayQueue~play
 * @description Fired when a new song starts playing.
 * @type {object}
 * @property {Song} song - The playing song.
 * @property {number} queueNumber - Current queueNumber.
 * @property {object} audio
 * @property {boolean} audio.paused - Paused state of audio.
 * @property {boolean} audio.isStopped - Stopped state of playQueue.
 * @property {number} audio.currentTime - Current time of audio.
 * @property {number} audio.duration - Duration time of audio.
 * @property {string} audio.src - Src time of audio.
 * @property {string} audio.volume - Volume time of audio.
 */