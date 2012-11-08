function EventEmitter() {}

EventEmitter.prototype.on = function(eventName, listener) {
    this._events = this._events || {};
    var listeners = this._events[eventName] || (this._events[eventName] = []);
    listeners.push(listener);
};

EventEmitter.prototype.off = function(eventName, listener) {
    if (this._events && this._events[eventName]) {
        var index = this._events[eventName].indexOf(listener);
        if (index > -1) {
            this._events[eventName].splice(index, 1);
        }
   }
};

EventEmitter.prototype.trigger = function(eventName) {
    if (this._events && this._events[eventName]) {
        var args = Array.prototype.slice.call(arguments, 1); // remove eventName
        var self = this;
        this._events[eventName].forEach(function(listener) {
            listener.apply(self, args);
        });
   }
};
