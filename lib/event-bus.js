class EventBus {
  
  constructor() {
    if (!EventBus.instance) {
      EventBus.instance = this;
      this.listeners = {};
    }
    return EventBus.instance;
  }
  
  on(type, listener, checkAllowed = false) {
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
  
  off(type, listener) {
    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type].forEach((l, i) => {
        if (listener) {
          if (l === listener) {
            this.listeners[type].splice(i, 1);
          } 
        } else {
          this.listeners[type] = [];
        }    
      });
    }
  }
  
  trigger(type, data) {
    if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
  		const array = this.listeners[type].slice();
  		array.forEach(listener => {
    		Object.assign(data, this.eventExtras(type));
    		listener.apply(null, [data]);
  		});
    }
  }
  
  //todo add in extra props (song, etc)
  eventExtras(type) {
    return {
      'type': type,
      'timestamp': new Date().getTime()
    };
  }
  
  get allowedTypes() {
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
    }
  }
  
}

export {EventBus}