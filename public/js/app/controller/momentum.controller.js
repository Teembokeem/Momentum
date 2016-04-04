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

    var scene=new THREE.Scene(),
        light= new THREE.AmbientLight(0xffffff),
        renderer,
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 ),
        renderer = new THREE.WebGLRenderer(),
        mouseX = 0,
        mouseY = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("momentum").appendChild(renderer.domElement);

    var geometry = new THREE.IcosahedronGeometry( 50, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
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
      cube.rotation.x += 0.005;

      renderer.render( scene, camera );
    }
    render();


  }
})();
