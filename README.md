# Playqueue

This is a wrapper of sorts around an Audio object to provide extra funcitonality
that is always needed when writing a music player. Given a list of songs, it will
provide functionality such as 

    * skipping to the next song once the current one has finished.
    * triggering an event when the song is halfway finished (useful for scrobbling)
    * storing the list in localStoarge
    * moving songs from one spot to another
    * and much more


## Install

    npm install playqueue


## Usage

    var PlayQueue = require('playqueue'),
        pq = new PlayQueue({'audio': new Audio()});
    
    pq.add(['url', 'url2']);
    pq.play(0);
    pq.addEventListener('songHalf', function(e){...})