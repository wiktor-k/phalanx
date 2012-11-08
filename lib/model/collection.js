function Collection() {
    this.models = [];
}

Collection.prototype.on = EventEmitter.prototype.on;
Collection.prototype.trigger = EventEmitter.prototype.trigger;

Collection.prototype.add = function(model, options) {
    if (options && typeof options.index !== "undefined") {
        this.models.splice(options.index, 0, model);
        this.trigger("add", model, { at: options.index });
    } else {
        this.models.push(model);
        this.trigger("add", model, { at: this.models.length - 1 });
    }
};

Collection.prototype.remove = function(model) {
    var index = this.models.indexOf(model);
    if (index > -1) {
        this.models.splice(index, 1);
        this.trigger("remove", model, {at: index});
    }
};

Collection.prototype.at = function(index) {
    return this.models[index];
};
