var View = {};

View.capture = function(node) {
    var n = node.cloneNode(true);
    node.parentNode.removeChild(node);
    return {
        get: function() { return n.cloneNode(true); }
    };
};

View.interpolate = function(node, value) {
    var variable = node.dataset.bind;
    if (variable) {
        node.textContent = value;
    }
    variable = node.dataset.bindValue;
    if (variable && typeof value !== "undefined") {
        node.value = value;
    }
};

View.getBindings = function(node) {
    function getBinding(node) { return { name: node.dataset.bind || node.dataset.bindValue, node: node }; }
    return Array.prototype.map.call(node.querySelectorAll("[data-bind], [data-bind-value]"), getBinding);
};

View.getEventBindings = function(node) {
    function getBinding(node) { return { name: node.dataset.bindEvent, node: node }; }
    return Array.prototype.map.call(node.querySelectorAll("[data-bind-event]"), getBinding);
};

View.template = function(node) {
    var captured = View.capture(node);
    function handleEvent(e) {
        var method = e.detail;
        if (template[method]) {
            template[method].apply(this, arguments);
        }
    }
    var template = {
        createView: function(model) {
            var view = new ModelView(captured, model);
            view._node.addEventListener("action", handleEvent.bind(view), false);
            return view;
        }
    };
    return template;
}
