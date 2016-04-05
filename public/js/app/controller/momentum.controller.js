(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentumController", MomentumController);

  MomentumController.$inject = ["$log", "$http", "$window"];

  function MomentumController($log, $http, $window) {
    $log.debug('MomentumController Loaded.')
    var vm = this;

    vm.createMoment = false;
    vm.conflict;

    vm.submitMoment = submitMoment;

    function submitMoment(data) {
      $log.debug("posting!", data);

    };

  };

})();

    // //VARIABLES FOR ENVIRONMENT
    // var scene       = new THREE.Scene(),
    //     light       = new THREE.AmbientLight(0xffffff),
    //     renderer,
    //     camera      = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 ),
    //     renderer    = new THREE.WebGLRenderer(),
    //     mouseX      = 0,
    //     mouseY      = 0,
    //     windowHalfX = window.innerWidth / 2,
    //     windowHalfY = window.innerHeight / 2;

    // renderer.setSize( 1000, 450 );
    // document.getElementById("momentum").appendChild(renderer.domElement);

    // //MOMENT CREATION
    // var geometry;

    // //RANDOMIZER UTILITY
    // function rng(max, min, bool) {
    //   if (bool) return Math.floor((Math.random() * (max - min)) + min);
    //   else return (Math.random() * (max - min)) + min;
    // };

    // //MOMENT VARIABLES
    //   //ensures, width is is never the height: no squares
    // var momentFactor    = rng(0.75, 0.5, false);
    //   //defines bounding vertices for the gem (y-direction)
    // var momentApexNadir = [ rng(200, 100, true), -(rng(200, 100, true)) ];
    //   //defines outermost bound along the length of the moment
    // var momentPole      = Math.floor(momentApexNadir[0] * momentFactor);
    //   //TODO: need to sengment momentPole into n sections and push randomly into array, tRings argument should end up being num
    // var tRings = [];
    // function tRingsGenerator() {
    //   tRings.push(rng(5))
    // }

    // console.log(tRings)

    // $log.debug("your apex and nadir:", momentApexNadir)
    // $log.debug("your pole:", momentPole)

    // // function boundingCircles(squaredRadius) {
    // //   $log.info("Creating our paired coordinates")
    // //   var x = rng(squaredRadius, 0, true);
    // //   $log.info("Randomized x value: should be greater than 0 and less than " + squaredRadius + ":", x);
    // //   var z = (function(compCoordinate) {
    // //     var num;
    // //     return num > Math.pow(((momentPole / 5) + (momentPole / 5) / 3) - x, 0.5 ) &&
    // //   })
    // //   $log.info("Randomized x value: should be greater than 0 and less than " + squaredRadius + ":", x);

    // // }


    // var points = [
    //   new THREE.Vector3(   0,  momentApexNadir[0],   0 ),
    //   new THREE.Vector3(   0, momentApexNadir[1],   0 ),
    //   new THREE.Vector3(   -momentPole, -rng(momentApexNadir[0] - 20, momentApexNadir[0] - 50, true),   momentPole ),
    //   new THREE.Vector3(   momentPole, -rng(momentApexNadir[0] - 20, momentApexNadir[0] - 50, true),   -momentPole ),
    //   new THREE.Vector3(   -momentPole, rng(momentApexNadir[0] - 50, momentApexNadir[0] - 40, true),   -momentPole ),
    //   new THREE.Vector3(   momentPole, rng(momentApexNadir[0] - 80, momentApexNadir[0] - 80, true),   momentPole ),
    //   new THREE.Vector3(   -momentPole, -rng(momentApexNadir[0] -  50, momentApexNadir[0] -70, true),   momentPole ),
    //   new THREE.Vector3(   momentPole, -rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   -momentPole ),
    //   new THREE.Vector3(   -momentPole, rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   -momentPole ),
    //   new THREE.Vector3(   momentPole, rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   momentPole )
    // ];

    // // console.log("your vertices:", geometry.vertices[2], geometry.vertices[3], geometry.vertices[4], geometry.vertices[5])

    // // geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    // // geometry.faces.push( new THREE.Face3( 0, 1, 3 ) );
    // // geometry.faces.push( new THREE.Face3( 0, 1, 4 ) );
    // // geometry.faces.push( new THREE.Face3( 0, 1, 5 ) );


    // // geometry.computeBoundingSphere();
    // geometry = new THREE.ConvexGeometry( points );

    // var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube, light );
    // camera.position.z = 500;


    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );


    // requestAnimationFrame(render);

    // function onDocumentMouseMove( event ) {
    //         mouseX = ( event.clientX - windowHalfX );
    //         mouseY = ( event.clientY - windowHalfY );
    //       }

    // function render() {
    //   requestAnimationFrame( render );
    //   // camera.position.x += ( mouseX - camera.position.x );
    //   // camera.position.y += ( - mouseY - camera.position.y );
    //   // camera.lookAt( scene.position );
    //   cube.rotation.y += 0.001;

    //   // console.log(cubic-bezier(.17,.67,.83,.67))

    //   renderer.render( scene, camera );
    // }
    // render();

