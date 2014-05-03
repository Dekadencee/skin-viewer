require.config({
  paths: {
    modernizr: '../libs/modernizr/2.8.0/modernizr.min',
    text:      '../libs/require-text/2.0.10/text',
    stats:     '../libs/stats/r11/stats.min',
    three:     '../libs/three/r67/three.min'
  },
  shim: {
    stats: {
      exports: 'Stats'
    },
    three: {
      exports: 'THREE'
    }
  }
})

require([
  'three',
  './loaders/objloader',
  './controls/orbitcontrols'
], function (THREE, OBJLoader, OrbitControls) {

  var container, stats
  var camera, controls, scene, renderer
  var ambient, directionalLight
  var mouseX = 0, mouseY = 0

  var windowHalfX = window.innerWidth / 2
  var windowHalfY = window.innerHeight / 2

  function init () {
    container = document.createElement('div')
    document.body.appendChild(container)

    // == Camera

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000)
    camera.position.z = 100

    // == Controls

    controls = new OrbitControls(camera)

    controls.addEventListener('change', render)


    // == Scene

    scene = new THREE.Scene()

    // == Lighting

    ambient          = new THREE.AmbientLight(0x101030)
    directionalLight = new THREE.DirectionalLight(0xffeedd)

    directionalLight.position.set(0, 0, 1)

    scene.add(ambient)
    scene.add(directionalLight)

    // == Loading Manager

    var manager = new THREE.LoadingManager()

    manager.onProgress = function (item, loaded, total) {
      // console.log(item, loaded, total)
    }

    // == Texture

    var texture = new THREE.Texture()
    var loader  = new THREE.ImageLoader(manager)

    loader.load('assets/models/ahri/ahri_base.jpg', function (image) {
      texture.image       = image
      texture.needsUpdate = true
    })

    // == Model

    var loader = new OBJLoader(manager)

    loader.load('assets/models/ahri/ahri.obj', function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.map = texture
        }
      })

      object.position.y = -80

      scene.add(object)
    })

    // == Renderer

    renderer = new THREE.WebGLRenderer({
      alpha: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // == Events

    window.addEventListener('resize', onWindowResize, false)

  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate () {
    requestAnimationFrame(animate)
    render()
  }

  function render() {
    renderer.render(scene, camera)
  }

  init()
  animate()

})