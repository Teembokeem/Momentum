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

    //VARIABLES FOR ENVIRONMENT
    var scene       = new THREE.Scene(),
        light       = new THREE.AmbientLight(0xffffff),
        renderer,
        camera      = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 ),
        renderer    = new THREE.WebGLRenderer(),
        mouseX      = 0,
        mouseY      = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    renderer.setSize( 1000, 450 );
    document.getElementById("momentum").appendChild(renderer.domElement);

    //MOMENT CREATION
    var geometry = new THREE.Geometry();

    //RANDOMIZER UTILITY
    function rng(max, min, bool) {
      if (bool) return Math.floor((Math.random() * (max - min)) + min);
      else return (Math.random() * (max - min)) + min;
    };

    //MOMENT VARIABLES
    var momentFactor    = rng(0.75, 0.5, false);
    var momentApexNadir = [ rng(200, 100, true), -(rng(200, 100, true)) ];
    $log.debug("your apex and nadir:", momentApexNadir)


    geometry.vertices.push(
      new THREE.Vector3(   0,  momentApexNadir[0],   0 ),
      new THREE.Vector3(   0, momentApexNadir[1],   0 ),
      new THREE.Vector3(   -100, rng(momentApexNadir[0] - 20, momentApexNadir[0] -50, true),   100 ),
      new THREE.Vector3(   100, rng(momentApexNadir[0] - 20, momentApexNadir[0] -50, true),   -100 ),
      new THREE.Vector3(   -100, rng(momentApexNadir[0] - 20, momentApexNadir[0] -50, true),   -100 ),
      new THREE.Vector3(   100, rng(momentApexNadir[0] - 20, momentApexNadir[0] -50, true),   100 )
    );

    console.log("your vertices:", geometry.vertices[2], geometry.vertices[3], geometry.vertices[4], geometry.vertices[5])

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push( new THREE.Face3( 0, 1, 3 ) );
    geometry.faces.push( new THREE.Face3( 0, 1, 4 ) );
    geometry.faces.push( new THREE.Face3( 0, 1, 5 ) );


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
      cube.rotation.y += 0.001;

      // console.log(cubic-bezier(.17,.67,.83,.67))

      renderer.render( scene, camera );
    }
    render();


  }
})();
