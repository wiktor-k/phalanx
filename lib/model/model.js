function Model() {

}

Model.add = function(modelType) {
    modelType.prototype.on = EventEmitter.prototype.on;
    modelType.prototype.off = EventEmitter.prototype.off;
    modelType.prototype.trigger = EventEmitter.prototype.trigger;

    modelType.attributes.forEach(function(attribute) {
        Object.defineProperty(modelType.prototype, attribute, {
            get: function() {
                return this["_" + attribute];
            },
            set: function(value) {
                this["_" + attribute] = value;
                this.trigger("change:" + attribute);
            }
        });
    });

    for (var key in Model.prototype) {
        modelType.prototype[key] = Model.prototype[key];
    }
};

Model.prototype.clone = function() {
    var newObj = new this.constructor();
    var self = this;
    this.constructor.attributes.forEach(function(attributeName) {
        newObj[attributeName] = self[attributeName];
    });
    return newObj;
};
