define([
  'underscore',
  'three',
  './controls/orbit',
  './loaders/obj'
], function (_, THREE, OrbitControls, OBJLoader) {

  var defaultOptions = {

    // Stats object
    stats: null,

  }

  var Viewer = function (options) {
    if (!(this instanceof Viewer)) {
      return new Viewer(options)
    }

    this.options = _.extend(defaultOptions, options)
    this.initialize()
  }

  Viewer.prototype = {

    constructor: Viewer,

    data: {
      manager: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      animateCallbacks: []
    },

    loader: null,

    initialize: function () {
      var viewer = this

      // Container
      // ---------

      viewer.el = document.createElement('div')
      document.body.appendChild(viewer.el)

      // Loader
      // ------

      viewer.data.manager = new THREE.LoadingManager()

      viewer.data.manager.onProgress = function (item, loaded, total) { console.log(item, loaded, total) }
      viewer.data.manager.onLoad     = function () { }

      // Scene
      // -----

      viewer.data.scene    = new THREE.Scene()

      // Camera
      // ------

      viewer.data.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000)
      viewer.data.camera.position.x = -300
      viewer.data.camera.position.y = 300
      viewer.data.camera.position.z = 900

      // Controls
      // --------

      viewer.data.controls = new OrbitControls(viewer.data.camera, viewer.el)
      viewer.data.controls.addEventListener('change', function () {
        viewer.render()
      })

      // Renderer
      // --------

      viewer.data.renderer = new THREE.WebGLRenderer({ alpha: true })

      viewer.data.renderer.setClearColor(0)
      viewer.data.renderer.shadowMapEnabled = true
      viewer.data.renderer.shadowMapSoft = true;

      viewer.el.appendChild(viewer.data.renderer.domElement)

      // Resize Listener
      // ---------------

      viewer.resize() && window.addEventListener('resize', function () {
        viewer.resize()
      })

    },

    addLight: function () {
      var directional, ambient

      directional = new THREE.DirectionalLight(16777215, 0.5)
      ambient     = new THREE.AmbientLight(16777215)
      point       = new THREE.PointLight(16777215)

      directional.position.set(50, 50, 50)
      directional.castShadow = true

      point.position.set(30, 30, 1)
      point.intensity  = 1

      this.data.scene.add(directional)
      this.data.scene.add(ambient)
      this.data.scene.add(point)

      return this
    },

    addGround: function () {
      var loader, texture, material, geometry, mesh
      var viewer = this

      loader  = new THREE.ImageLoader(viewer.manager)
      texture = new THREE.Texture()

      loader.load('assets/textures/ground/grass.jpg', function (image) {
        texture.image       = image
        texture.needsUpdate = true

        material = new THREE.MeshPhongMaterial({ color: 16777215, specular: 1118481, side: THREE.DoubleSide })
        geometry = new THREE.BoxGeometry(500, 500, 10)
        mesh     = new THREE.Mesh(geometry, material)

        material.map = texture

        texture.wrapS      = THREE.RepeatWrapping
        texture.wrapT      = THREE.RepeatWrapping
        texture.anisotropy = 16
        texture.repeat.set(5, 5)

        mesh.position.y    = -5
        mesh.rotation.x    = - Math.PI / 2
        mesh.receiveShadow = true

        viewer.data.scene.add(mesh)
      })

      return this
    },

    addChampion: function (champion, skin, scale) {
      var imageLoader, objLoader, texture
      var viewer = this

      if (!scale) {
        scale = 1
      }

      viewer.addLight()
      viewer.addGround()

      texture   = new THREE.Texture()
      imgLoader = new THREE.ImageLoader(viewer.manager)
      objLoader = new OBJLoader(viewer.manager)

      imgLoader.load('assets/textures/champions/' + skin, function (image) {
        texture.image      = image
        texture.needsUpdate = true
      })

      objLoader.load('assets/models/champions/' + champion, function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.map       = texture
            // child.material.wireframe = true
            child.castShadow         = true
          }
        })

        object.position.y = 0
        object.position.x = 0
        object.position.z = 0

        object.scale.set(scale, scale, scale)

        viewer.data.scene.add(object)
      })

      return this
    },

    resize: function () {
      this.data.camera.aspect = window.innerWidth / window.innerHeight
      this.data.camera.updateProjectionMatrix()
      this.data.renderer.setSize(window.innerWidth, window.innerHeight)
      return this
    },

    clear: function () {
      var viewer = this

      _.each(_.rest(viewer.data.scene.children, 1), function (object) {
        viewer.data.scene.remove(object)
      })

      return this
    },

    render: function () {
      this.data.renderer.render(this.data.scene, this.data.camera)
      return this
    },

    animate: function () {
      var viewer = this,
          stats  = typeof this.options.stats === 'object'

      stats && this.options.stats.begin()

      requestAnimationFrame(function () {
        return viewer.animate()
      })

      _.each(viewer.data.animateCallbacks, function (callback) {
        callback.call(viewer)
      })

      viewer.render()

      stats && this.options.stats.end()

      return this
    }

  }

  return Viewer

})