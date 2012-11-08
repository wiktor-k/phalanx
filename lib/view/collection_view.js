function CollectionView(capturedNode, collection, modelViewFactory) {
    if (capturedNode instanceof HTMLElement) {
        this._node = capturedNode;
    } else {
        this._node = capturedNode.get();
    }

    if (typeof modelViewFactory === "undefined") {
        modelViewFactory = View.template(this._node.querySelector("[data-repeat]"));
    }

    var node = this._node;
    var subviews = [];
    collection.on("add", function(model, options) {
        var next = node.childNodes[options.at];
        var view = modelViewFactory.createView(model);
        if (next) {
            node.insertBefore(view._node, next);
        } else {
            node.appendChild(view._node);
        }

        view._node.addEventListener("action", handleEvent.bind(view), false);
        subviews[options.at] = view;
    });
    collection.on("remove", function(model, options) {
        var view = subviews[options.at];
        node.removeChild(view._node);
    });

    var self = this;
    function handleEvent(e) {
        var method = e.detail;
        if (self[method]) {
            self[method].apply(this, arguments);
        }
    }
}
