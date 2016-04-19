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
  'jquery',
  'underscore',
  'stats',
  'dat',
  './detector',
  './viewer'
], function ($, _, Stats, dat, Detector, Viewer) {

  var viewer, stats, gui, skinController
  var champions = {},
      skins     = []

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage()
  }

  // Display controls
  var controls = {
    champion: '',
    skin: ''
  }

  // Retrieve champions
  $.getJSON('api/champions.json', function (json) {
    champions = json
    init()
  })

  stats  = new Stats()
  gui    = new dat.GUI()
  viewer = new Viewer({
    stats: stats
  })

  function init () {
    var names = _.keys(champions)

    // Set the first champion, cause it needs to be set
    controls.champion = names.slice(0).shift()
    controls.skin     = champions[controls.champion].slice(0).shift().name

    // Add the champion select box
    gui.add(controls, 'champion', names).onChange(function (champion) {
      fetchSkins()
      loadChampion()
    })

    // Load the skin initially.
    fetchSkins()
    loadChampion()

    // stats positioning
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.top      = '10px'
    stats.domElement.style.left     = '10px'

    document.body.appendChild(stats.domElement)

    viewer.animate()
  }

  function loadChampion () {
    viewer.clear()

    _.each(champions[controls.champion], function (skin) {
      if (skin.name === controls.skin) {
        viewer.addChampion(skin.object, skin.texture, (skin.scale ? skin.scale : null))
      }
    })
  }

  function fetchSkins() {
    skins = _.map(champions[controls.champion], function (value, key) {
      return value.name
    })

    if (skinController) {
      gui.remove(skinController)
      skinController = null
    }

    skinController = gui.add(controls, 'skin', skins).onChange(loadChampion)
    controls.skin  = skins.slice(0).shift()
  }

})
