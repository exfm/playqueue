"use strict";

function PlayQueue(){
    this.items = [];
}

PlayQueue.prototype.add = function(item){
    this.items.push(item);
};

PlayQueue.prototype.getItem = function(id){
    var item;
    this.items.some(function(i){
        if(i.id === id){
            item = i;
            return true;
        }
    });
    return item;
};