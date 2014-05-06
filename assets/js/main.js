require.config({
  paths: {
    dat:        '../libs/dat-gui/0.5/dat.gui.min',
    jquery:     '../libs/jquery/2.1.1/jquery.min',
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
    jquery: {
      exports: '$'
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
  './viewer'
], function (Viewer) {

  new Viewer().animate()

})