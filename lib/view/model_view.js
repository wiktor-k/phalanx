function ModelView(capturedNode, model) {
    if (capturedNode instanceof HTMLElement) {
        this._node = capturedNode;
    } else {
        this._node = capturedNode.get();
    }

    View.getBindings(this._node).forEach(function(binding) {
        model.on("change:" + binding.name, function() {
            View.interpolate(binding.node, model[binding.name]);
        });
        View.interpolate(binding.node, model[binding.name]);
        binding.node.addEventListener("change", function() {
            model[binding.name] = this.value;
        });
    });
    var self = this;
    View.getEventBindings(this._node).forEach(function(binding) {
        var parts = binding.name.split(' ');
        var eventName = parts[0];
        var method = parts[1];
        binding.node.addEventListener(eventName, function() {
            self[method].apply(self, arguments);
        });
    });
}
