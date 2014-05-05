require.config({
  paths: {
    dat:        '../libs/dat-gui/0.5/dat.gui.min',
    modernizr:  '../libs/modernizr/2.8.0/modernizr.min',
    text:       '../libs/require-text/2.0.10/text',
    stats:      '../libs/stats/r11/stats.min',
    three:      '../libs/three/r67/three.min',
    underscore: '../libs/underscore/1.6.0/underscore.min'
  },
  shim: {
    dat: {
      exports: 'dat'
    },
    stats: {
      exports: 'Stats'
    },
    three: {
      exports: 'THREE'
    },
    underscore: {
      exports: '_'
    }
  }
})

require([
  'viewer',
  'dat'
], function (SkinViewer, dat) {

  var viewer, gui

  // == Stub Data

  var stubs = {
    'texture':   true,
    'wireframe': false,
    'champion':  'ahri'
  }

  // == Viewer

  viewer = new SkinViewer()

  // == Gui

  gui = new dat.GUI()

  // texture
  gui.add(stubs, 'texture').onChange(function () {
    viewer.options.texture = stubs.texture
    viewer.setModel(viewer.options.model)
  })

  // wireframe
  gui.add(stubs, 'wireframe').onChange(function () {
    viewer.options.wireframe = stubs.wireframe
    viewer.setModel(viewer.options.model)
  })

  // champion model
  gui.add(stubs, 'champion', [
    'ahri',
    'sona'
  ]).onChange(function (model) {
    viewer.setModel(model)
  })

  // == Initialize

  viewer.animate()

})