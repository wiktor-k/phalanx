function CollectionView(capturedNode, collection, modelViewFactory) {
    var node = capturedNode.get();
    this._node = node;
    var subviews = [];
    collection.on("add", function(model, options) {
        var next = node.childNodes[options.at];
        var view = modelViewFactory.createView(model);
        if (next) {
            node.insertBefore(view._node, next);
        } else {
            node.appendChild(view._node);
        }
        subviews[options.at] = view;
    });
    collection.on("remove", function(model, options) {
        var view = subviews[options.at];
        node.removeChild(view._node);
    });
}
