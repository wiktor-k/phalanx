function ModelView(capturedNode, model) {
    if (capturedNode instanceof HTMLElement) {
        this._node = capturedNode;
    } else {
        this._node = capturedNode.get();
    }

    var self = this;
    this._node.addEventListener("action", function(e) {
        var method = e.detail.method;
        if (self[method]) {
            self[method].call(self, e.detail.originalEvent);
        }
    }, false);

    this.model = model;
}

Object.defineProperty(ModelView.prototype, "model", {
    get: function() {
        return this._model;
    },
    set: function(model) {
        if (this._model) {

            var oldModel = this._model;

            this._bindings.forEach(function(binding) {
                oldModel.off("change:" + binding.name, binding.listener);
                binding.node.removeEventListener("change", binding.changeListener);
                View.interpolate(binding.node, "");
            });

            this._eventBindings.forEach(function(binding) {
                var parts = binding.name.split(' ');
                var eventName = parts[0];
                binding.node.removeEventListener(eventName, binding.listener, false);
            });
        }


        this._model = model;

        if (!this._model) {
            this._bindings = [];
            this._eventBindings = [];
            return;
        }

        this._bindings = View.getBindings(this._node);

        this._bindings.forEach(function(binding) {
            binding.listener = function() {
                View.interpolate(binding.node, model[binding.name]);
            };
            model.on("change:" + binding.name, binding.listener);

            View.interpolate(binding.node, model[binding.name]);

            binding.changeListener = function() {
                model[binding.name] = this.value;
            };

            binding.node.addEventListener("change", binding.changeListener);
        });

        var self = this;
        this._eventBindings = View.getEventBindings(this._node);
        this._eventBindings.forEach(function(binding) {
            var parts = binding.name.split(' ');
            var eventName = parts[0];
            var method = parts[1];
            binding.listener = function(e) {
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent('action', true, true, {method: method, originalEvent: e});
                this.dispatchEvent(evt);
            };
            binding.node.addEventListener(eventName, binding.listener, false);
        });
    }
})

ModelView.prototype.find = function(selector) {
    return this._node.querySelector(selector);
};
