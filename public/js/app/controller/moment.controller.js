(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentController", MomentController);

  MomentController.$inject = ["$log", "$http", "$state", "$window", "tokenService"];

  function MomentController($log, $http, $state, $window, token) {
    $log.debug('MomentController Loaded.')
    //variables
    var vm = this;
    vm.moments;
    vm.selectedMoment;
    vm.conflict;
    vm.showForm = false;
    vm.accumulator = 0;
    vm.imageNum = 0;
    vm.momentTemplate = {
      title: "",
      text: "",
      images: "",
      date: ""
    }
    vm.newMoment = {
      title: "",
      text: "",
      images: [],
      date: ""
    }

    //bindings
    vm.transition   = transition;
    vm.updateArray = updateArray;
    vm.submitMoment = submitMoment;
    vm.renderMoment = renderMoment;
    vm.updateMoment = updateMoment;


    //HELPERS
    function transition(state, data) {
      console.log("state chosen:", state ? state : "main")
      $state.go("moment" + state, data);
      if (state === '.create') {
        render();
      } else {
        $('canvas').remove();
      }
    };

    function updateArray() {
      $log.debug("clicked up")
      vm.newMoment.images[vm.accumulator] = vm.newMoment.images[vm.accumulator].substring(0, vm.newMoment.images[vm.accumulator].length - 1);
      vm.accumulator++
    }
    //functions
    function submitMoment(data) {
      $log.debug("posting!", data);
      $http({
        method: 'POST',
        url: "api/moments",
        data: data
      })
      .then(function(res) {
        $log.debug("successfully added moment", res.data)
        transition('.show', {"id": res.data._id})
      })
    };

    function renderMoment(index) {
      vm.momentTemplate = {
        title: vm.moments[index].title,
        text: vm.moments[index].text,
        images: vm.moments[index].images,
        date: vm.moments[index].createdAt
      };
      vm.selectedMoment = vm.moments[index];
      $log.debug("your selected div:", vm.momentTemplate);
      transition('.show', {"id": vm.selectedMoment._id});
    }

    function updateMoment() {
      $log.debug(vm.selectedMoment)
      $http({
        method: "PUT",
        url: "api/moments/" + vm.selectedMoment._id,
        data: vm.selectedMoment
      })
      .then(
        function(res) {
          $log.debug("success!", res.data)
          vm.showForm = !vm.showForm;
        }, function(err) {
          $log.debug("failure!", err)
        }
      );
    }

    function grabMoments() {
      var promise = $http({
        method: 'GET',
        url: "api/moments"
      })
      .then(
        function(res) {
          console.log(res.data);
          vm.moments = res.data.moments;
          vm.moments.forEach(function(moment) {
            var date = new Date(moment.createdAt);
            moment.createdAt = date.toString("MM dd")
          });
        },
        function(err) {
          console.log("something went wrong:", err)
        })
      return promise;
    };


  grabMoments();

  //VARIABLES FOR ENVIRONMENT
  var scene       = new THREE.Scene(),
      light       = new THREE.AmbientLight(0xffffff),
      renderer,
      camera      = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1500 ),
      renderer    = new THREE.WebGLRenderer(),
      mouseX      = 0,
      mouseY      = 0,
      windowHalfX = window.innerWidth / 2,
      windowHalfY = window.innerHeight / 2;

  //MOMENT CREATION
  var geometry;
  geometry = new THREE.Geometry();
  var rng = function(max, min) {
    return Math.floor((Math.random() * (max - min)) + min )
  }

  //A. DEFINE YOUR APEX/NADIR
 var momentApexNadir = [ 400, -400 ];
  var momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1])

  //B. DEFINE POLES
  var momentPoles     = [ 160,  320 ];
  var momentGirth     = momentPoles[1] - momentPoles[0];

  //C. DEFINE PARTITIONS
  var numPartitions = 3;
  var partitionParams = [];
  function createPartitions(n) {
    for ( var i = 0; i < n + 1; i++ ) {
      partitionParams.push(
        [
          momentApexNadir[1] + (i * (momentRange / ( n+1 ))),
          momentApexNadir[1] + ((i + 1) * (momentRange / ( n+1 )))
        ]
      )
    };
  };
  var partitionRange = partitionParams[0][1] - partitionParams[0][0];

  //D. DEFINE RINGS
  var numRings = 5;
  var ringParams = [];
  function createRings(n) {
    for ( var i = 0; i < n + 1; i++ ) {
      ringParams.push(
        [
          momentPoles[0] + (i * (momentGirth / ( n+1 ))),
          momentPoles[0] + ((i + 1) * (momentGirth / ( n+1 )))
        ]
      )
    };
  };


  //E. "RANDOMLY" CHOOSE SECTOR
  var numBodies = 10;
  var constellation = [];
  function createConstellation(n) {
    for (var i = 0; i < n + 1; i++) {
      var constellationX = rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]);
      constellation.push(
        [
          constellationX,
          rng(partitionParams[i % partitionParams.length][1], partitionParams[i % partitionParams.length][0]),
          Math.pow((Math.pow(partitionRange, 2) - Math.pow(constellationX, 2)) , 0.5)
        ])
    }
  }

  geometry.vertices.push(
    new THREE.Vector3(   0,  100,   0 ),
    new THREE.Vector3(   0, -100,   0 ),
    new THREE.Vector3(  8 * Math.pow(2, 0.5), 0, 8 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   -8 * Math.pow(2, 0.5), 0,  8 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   0, 0,   -16 ),
    new THREE.Vector3(  -8 * Math.pow(2, 0.5), 0, -8 * Math.pow(2, 0.5) ),
    new THREE.Vector3(  8 * Math.pow(2, 0.5), 0, -8 * Math.pow(2, 0.5) ),

    // new THREE.Vector3(  10 * Math.pow(2, 0.5), 0, 10 * Math.pow(2, 0.5) ),
    // new THREE.Vector3(   -10 * Math.pow(2, 0.5), 0,  10 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   0, 40,   20 )


  );

  geometry.faces.push(
     new THREE.Face3( 0, 2, 3 ),
     new THREE.Face3( 0, 3, 5 ),
     new THREE.Face3( 0, 5, 4 ),
     new THREE.Face3( 0, 4, 6 ),
     new THREE.Face3( 0, 6, 2 ),
     new THREE.Face3( 0, 7, 3 ),
     new THREE.Face3( 0, 7, 2 ),
     new THREE.Face3( 1, 2, 3 ),
     new THREE.Face3( 1, 3, 5 ),
     new THREE.Face3( 1, 5, 4 ),
     new THREE.Face3( 1, 4, 6 ),
     new THREE.Face3( 1, 6, 2 )
     );

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
    cube.rotation.y += 0.007;

    // console.log(cubic-bezier(.17,.67,.83,.67))

    renderer.render( scene, camera );
    document.getElementById("momentum").appendChild(renderer.domElement);
    renderer.setSize( 1000, 450);
  }
  };

})();

