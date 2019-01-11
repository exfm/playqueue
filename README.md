# Playqueue

This is a wrapper of sorts around an Audio object to provide extra functionality
that is always needed when writing a music player. Given a list of songs, it will
provide functionality such as 

    * skipping to the next song once the current one has finished.
    * triggering an event when the song is halfway finished (useful for scrobbling)
    * storing the list in localStorage
    * moving songs from one spot to another
    * and much more


## Install

    npm install playqueue


## Usage

    import {PlayQueue} from 'playqueue'; 
    
    const audio = new Audio();
    const playQueue = new PlayQueue({
      'audio': audio
    });
    
    // add a song
    playQueue.add({'url': '1.mp3', 'title': 'One', 'artist': 'Cool Band', 'album': 'The Hits'});
    
    // play the song
    playQueue.play();
    
    // listen for 'playing' event
    playQueue.on('playing', (e, data) => {
      console.log(data);
    });
    
To see everything it can do, [view the docs](PlayQueue.html)