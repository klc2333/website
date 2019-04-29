
function ToolbarExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

ToolbarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolbarExtension.prototype.constructor = ToolbarExtension;

ToolbarExtension.prototype.load = function() {

  alert('ready')

  if (this.viewer.toolbar) {
    // Toolbar is already available, create the UI
    this.createUI();
  } else {
    // Toolbar hasn't been created yet, wait until we get notification of its creation
    this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  }

  return true;
};

ToolbarExtension.prototype.onToolbarCreated = function() {
  this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

ToolbarExtension.prototype.createUI = function() {

  var viewer = this.viewer;
  var control = viewer.toolbar.getControl('modelTools');

  control.removeControl('toolbar-explodeTool');
};



ToolbarExtension.prototype.unload = function() {
  this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};


Autodesk.Viewing.theExtensionManager.registerExtension('ToolbarExtension', ToolbarExtension);
