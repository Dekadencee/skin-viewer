define([
  'underscore',
  'three',
  './loaders/objloader',
  './controls/orbitcontrols'
], function (_, THREE, OBJLoader, OrbitControls) {

  var defaultOptions = {
    assets:    'assets/models',
    wireframe: false,
    texture:   true,
    model:     'ahri'
  }

  var Viewer = function (options) {
    this.options = _.extend(defaultOptions, options)
    this.initialize()
  }

  Viewer.prototype = {

    // constructor
    constructor: Viewer,

    // Null values
    container:   null,
    camera:      null,
    controls:    null,
    scene:       null,
    lighting:    [],
    manager:     null,
    loader:      null,
    renderer:    null,

    initialize: function () {
      var self = this

      this.container = document.createElement('div')
      document.body.appendChild(this.container)

      // == Camera

      this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 2000)
      this.camera.position.z = 100

      // == Scene

      this.scene = new THREE.Scene()

      // == Loading Manager

      this.manager = new THREE.LoadingManager()

      this.manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total)
      }

      this.manager.onLoad = function () {
        document.querySelectorAll('.loading-state')[0].classList.add('hidden')
      }

      // == Render the initial model

      this.setModel(this.options.model)

      // == Controls

      this.controls = new OrbitControls(this.camera, this.container)
      this.controls.addEventListener('change', function () {
        self.render()
      })

      // == Renderer

      this.renderer = new THREE.WebGLRenderer({
        alpha: true
      })

      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.renderer.shadowMapEnabled = true
      this.renderer.shadowMapSoft = true;

      // Allow it to exist in the dom
      this.container.appendChild(this.renderer.domElement)

      // == Listeners

      window.addEventListener('resize', function () {
        self.onWindowResize()
      }, false)

    },

    setModel: function (model) {
      var self = this

      this.clearScene()

      if (model !== this.options.model) {
        this.options.model = model
      }

      // == Loading

      document.querySelectorAll('.loading-state')[0].classList.remove('hidden')

      // == Lighting

      this.lighting.ambient     = new THREE.AmbientLight(0x101030)
      this.lighting.directional = new THREE.DirectionalLight(0xffeedd)

      this.lighting.directional.position.set(0, 5, 10)

      this.scene.add(this.lighting.ambient)
      this.scene.add(this.lighting.directional)

      // == Shadows

      this.lighting.directional.castShadow = true

      // == Texture

      if (this.options.texture === true) {
        var texture = new THREE.Texture()
        var loader  = new THREE.ImageLoader(this.manager)

        loader.load('assets/models/' + this.options.model + '/' + this.options.model + '.jpg', function (image) {
          texture.image       = image
          texture.needsUpdate = true
        })
      }

      // == Model

      this.loader = new THREE.OBJLoader(this.manager)

      this.loader.load('assets/models/' + this.options.model + '/' + this.options.model + '.obj', function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true

            if (self.options.texture === true) {
              child.material.map = texture
            }

            if (self.options.wireframe === true) {
              child.material.wireframe = true
            }
          }
        })

        object.position.y = -80

        self.scene.add(object)
      })

      // == Simple Ground

      var groundGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);

      ground = new THREE.Mesh(groundGeometry, new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      }))

      ground.position.y    = -80
      ground.rotation.x    = - Math.PI / 2
      ground.receiveShadow = true

      this.scene.add(ground);
    },

    clearScene: function () {
      var self = this

      _.each(_.rest(this.scene.children, 1), function (object) {
        self.scene.remove(object)
      })
    },

    onWindowResize: function () {
      windowHalfX = window.innerWidth / 2
      windowHalfY = window.innerHeight / 2

      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },

    render: function () {
      this.renderer.render(this.scene, this.camera)
    },

    animate: function () {
      var self = this

      requestAnimationFrame(function () { self.animate() })
      this.render()
    }

  }

  // == Export

  return Viewer

})