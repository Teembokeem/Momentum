(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentumController", MomentumController);

  MomentumController.$inject = ["$log", "$window"];

  function MomentumController($log, $window) {
    $log.debug('MomentumController Loaded.')
    var vm = this;

        "use strict";

    var scene       = new THREE.Scene(),
        light       = new THREE.AmbientLight(0xffffff),
        renderer,
        camera      = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 ),
        renderer    = new THREE.WebGLRenderer(),
        mouseX      = 0,
        mouseY      = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    renderer.setSize( 1000, 450 );
    document.getElementById("momentum").appendChild(renderer.domElement);

    // var geometry = new THREE.IcosahedronGeometry( 50, 1 );
    var geometry = new THREE.Geometry();

    function rng(max, min, bool) {
      if (bool) return Math.floor((Math.random() * (max - min)) + min);
      else return (Math.random() * (max - min)) + min;
    };

    var rngHeightWidthFactor = rng(0.75, 0.5, false);
    var rngApexNadir = [ rng(200, 100, true), -(rng(200, 100, true)) ];
    var rngPoles     = [ rngApexNadir[0] * rngHeightWidthFactor, rngApexNadir[1] * rngHeightWidthFactor ]

    $log.debug(rngPoles)

    geometry.vertices.push(
      new THREE.Vector3(   0,  rngApexNadir[0],   0 ),
      new THREE.Vector3(   0, rngApexNadir[1],   0 ),
      new THREE.Vector3(  rngPoles[0],   0,   rngPoles[0] ),
      new THREE.Vector3(   rngPoles[0],   40, rngPoles[1] ),
      new THREE.Vector3( rngPoles[1],   0,   rngPoles[0] ),
      new THREE.Vector3(   rngPoles[1],   40,  rngPoles[1] )
    );

    geometry.faces.push( new THREE.Face3( 0, 2, 5 ) );
    geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
    geometry.faces.push( new THREE.Face3( 0, 3, 4 ) );
    geometry.faces.push( new THREE.Face3( 0, 4, 5 ) );
    geometry.faces.push( new THREE.Face3( 1, 2, 5 ) );
    geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
    geometry.faces.push( new THREE.Face3( 1, 3, 4 ) );
    geometry.faces.push( new THREE.Face3( 1, 4, 5 ) );

    geometry.computeBoundingSphere();

    var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube, light );
    camera.position.z = 500;


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );


    requestAnimationFrame(render);

    function onDocumentMouseMove( event ) {
            mouseX = ( event.clientX - windowHalfX );
            mouseY = ( event.clientY - windowHalfY );
          }

    function render() {
      requestAnimationFrame( render );
      // camera.position.x += ( mouseX - camera.position.x );
      // camera.position.y += ( - mouseY - camera.position.y );
      // camera.lookAt( scene.position );
      cube.rotation.y += 0.005;

      // console.log(cubic-bezier(.17,.67,.83,.67))

      renderer.render( scene, camera );
    }
    render();


  }
})();
