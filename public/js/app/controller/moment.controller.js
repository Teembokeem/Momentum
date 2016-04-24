(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentController", MomentController);

  MomentController.$inject = ["$log", "$http", "$state", "$window", "tokenService", "$rootScope"];

  function MomentController($log, $http, $state, $window, token, $rootScope) {
    $log.debug("moment controller loaded")
    //variables
    var vm = this;
    vm.moments;
    vm.selectedMoment;
    vm.conflict;
    vm.showForm = false;
    vm.accumulator = 0;
    vm.imageNum = 0;
    vm.momentTemplate = {
      title:  "",
      text:   "",
      images: "",
      date:   ""
    }
    vm.newMoment = {
      title:  "",
      text:   "",
      images: [],
      date:   ""
    }

    //bindings
    vm.transition   = transition;
    vm.updateArray  = updateArray;
    vm.submitMoment = submitMoment;
    vm.renderMoment = renderMoment;
    vm.updateMoment = updateMoment;


    //HELPERS
    function transition(state, data) {
      $state.go("moment" + state, data)
    };

    function updateArray() {
      vm.newMoment.images[vm.accumulator] = vm.newMoment.images[vm.accumulator].substring(0, vm.newMoment.images[vm.accumulator].length - 1);
      vm.accumulator++
    }
    //functions
    function submitMoment(data) {
      $http({
        method: 'POST',
        url:    "api/moments",
        data:   data
      })
      .then(function(res) {
        renderMoment('', res.data._id, res.data.moment)
      })
    };

    function renderMoment(index, redirect, data) {
      if (index !== '') {
        vm.momentTemplate = {
          title:         vm.moments[index].title,
          text:          vm.moments[index].text,
          images:        vm.moments[index].images,
          date:          vm.moments[index].createdAt,
          constellation: vm.moments[index].constellation
        };
        vm.selectedMoment = vm.moments[index];
        transition('.show', {"id": vm.selectedMoment._id});
      }  else {
        vm.selectedMoment = data
        transition('.show', {"id": redirect});
      }
    };

    function updateMoment() {
      $http({
        method: "PUT",
        url:    "api/moments/" + vm.selectedMoment._id,
        data:   vm.selectedMoment
      })
      .then(
        function(res) {
          vm.showForm = !vm.showForm;
        },
        function(err) {
          $log.debug("Error Detected: ", err)
        }
      );
    }

    function grabMoments() {
      var promise = $http({
        method: 'GET',
        url:    "api/moments"
      })
      .then(
        function(res) {
          vm.moments = res.data.moments;
          vm.moments.forEach(function(moment) {
            var date         = new Date(moment.createdAt);
            moment.createdAt = date.toString("MM dd")
          });
        },
        function(err) {
          $log.debug("Error Detected: ", err);
        });
      return promise;
    };

//VARIABLES FOR 3D ENVIRONMENT
    vm.testVal = false;
    var scene    = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        camera   = new THREE.PerspectiveCamera( 90,  window.innerWidth / window.innerHeight, 0.5, 1500 );
    renderer.setSize( window.innerWidth, window.innerHeight - 300 );
    camera.position.z = 300;

//VARIABLES FOR CRYSTAL SYNTHESIS
  //A. DEFINE CRYSTAL APEX AND NADIR
    var momentApexNadir = [ 200, -200 ],
        momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1]),

  //B. DEFINE LATERAL POLES
        momentPoles     = [ 0,  50 ],
        momentGirth     = momentPoles[1] - momentPoles[0],
  //C.a Partition vars
        numPartitions   = rng(10,0),
        partitionParams = [],
        partitionRange,
  //D.a Ring vars
        numRings        = rng(10, 0),
        ringParams      = [],
  //E.a Constellation vars
        numBodies       = 0,
        constellation   = [],
        quadrantArray   = [1, 1, -1, -1],
  //G.a Geometry vars
        geometry,
        chosenMoment    = [],
        cube,
        material        = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
  //F.a THREE.js vars
        vm.newMoment.constellation = [];


//MOMENT CREATION

  //G.b FUNCTION CALLS
    function startConstellation() {
      if ($state.is("moment.create")) {
        scene.remove(cube)
        createPartitions(numPartitions);
        createRings(numRings);
        createConstellation(numBodies);
        createVertices(constellation);
        geometry = new THREE.ConvexGeometry( vm.newMoment.constellation );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        requestAnimationFrame(render);
      } else {
        scene.remove(cube)
        if (vm.selectedMoment.constellation.length > 0) {
          chosenMoment = [];
          createVertices(vm.selectedMoment.constellation )
          geometry = new THREE.ConvexGeometry( chosenMoment );
          cube = new THREE.Mesh( geometry, material );
          scene.add( cube );
          requestAnimationFrame(render);
        }
      }
    }


  //C.b DEFINE PARTITIONS
    function createPartitions(n) {
      for ( var i = 0; i < n + 1; i++ ) {
        partitionParams.push(
          [
            momentApexNadir[1] + ( i * (momentRange / ( n + 1 )) ),
            momentApexNadir[1] + ( (i + 1) * (momentRange / ( n + 1 )) )
          ]
        )
      };
      partitionRange = partitionParams[0][1] - partitionParams[0][0];
    };

  //D.b DEFINE RINGS
    function createRings(n) {
      for ( var i = 0; i < n + 1; i++ ) {
        ringParams.push(
          [
            momentPoles[0] + (i * (momentGirth / ( n+1 ))),
            momentPoles[0] + ((i + 1) * (momentGirth / ( n+1 )))
          ],
          [
            -(momentPoles[0] + (i * (momentGirth / ( n+1 )))),
            -(momentPoles[0] + ((i + 1) * (momentGirth / ( n+1 ))))
          ]
        )
      };
    };

  //E.b SYNTHESIZE CONSTELLATION SET
    function createConstellation(n) {
      for (var i = 0; i < n + 1; i++) {
        var constellationX = rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]);
        constellation.push(
          [
            quadrantArray[i % 4]         * rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]),
            quadrantArray[((i % 3) + 1)] * rng(partitionParams[i % partitionParams.length][1], partitionParams[i % partitionParams.length][0]),
            quadrantArray[((i % 2) + 1)] * Math.pow((Math.pow(ringParams[i % ringParams.length][1], 2) - Math.pow(constellationX, 2)) , 0.5)
          ])
      };
      constellation.push([0, momentApexNadir[0], 0])
      constellation.push([0, momentApexNadir[1], 0])
      constellation.sort(function(a, b) {
        if (a[1] > b[1]) {
          return 1;
        }
        if (a[1] < b[1]) {
          return -1;
        }
        return 0;
      })
    };

    //F.b CREATE THREE.js VERTICES
    function createVertices(array) {
      for (var i = 0; i < array.length; i++) {
        if ($state.is("moment.create")) {
          vm.newMoment.constellation.push(
            new THREE.Vector3( constellation[i][0],  constellation[i][1], constellation[i][2] )
          );
        } else if ($state.is("moment.show")) {
          chosenMoment.push(
            new THREE.Vector3( array[i].x,  array[i].y, array[i].z )
          )
        } else {

        }
      }
    }

    //HELPERS
    function rng(max, min) {
      return Math.floor((Math.random() * (max - min)) + min )
    };

    function render() {
      if (scene.children[0] !== undefined) {
        requestAnimationFrame(render);
        if ($state.is("moment.create")) {
          update(vm.testVal)
        }
        renderer.render( scene, camera );

        if (document.getElementsByTagName("canvas") !== undefined && ($state.is('moment.create') || $state.is('moment.show'))) {
          document.getElementById("momentum").appendChild( renderer.domElement)
          scene.children[0].rotation.y += 0.005;
          scene.children[0].position.set( -200, 0 , 0);
        }
      }
    };

    function createScene(a) {
      vm.testVal = false;
      vm.keyEvent = '';
      var currentRotationY = scene.children[0].rotation.y,
          currentPosition  = scene.children[0].position;
          // currentRotationX = scene.children[0].rotation.x;
      scene.remove(cube);
      geometry = new THREE.ConvexGeometry(a);
      material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, vertexColors: new THREE.Color( 0xffffff ), opacity: 0.7 } );
      cube     = new THREE.Mesh( geometry, material );
      scene.add( cube );
      scene.children[0].rotation.y = currentRotationY;
      scene.children[0].position.set(currentPosition);

      scene.children[0].geometry.faces.forEach(function(face) {
        face.vertexColors.push(
          new THREE.Color( 0xff0000 ),
          new THREE.Color( 0xff0000 ),
          new THREE.Color( 0xff0000 )
        )
      })
    }

    function update(a) {
      if (a === true && vm.keyEvent !== 8) {
        var someVal = rng(4,0);
        for (var i = 0; i < 1; i++) {
          var constellationX = rng(momentPoles[1], momentPoles[0]);
          vm.newMoment.constellation.push(new THREE.Vector3(
              quadrantArray[someVal % 4] *         rng(momentPoles[1], momentPoles[0]),
              quadrantArray[((someVal % 2) + 1)] * rng(momentApexNadir[1], momentApexNadir[0]),
              quadrantArray[((someVal % 2) + 1)] * Math.pow((Math.pow(momentPoles[1], 2) - Math.pow(constellationX, 2)) , 0.5)
          ))
        }
        createScene(vm.newMoment.constellation);
      } else if (a === true && vm.keyEvent === 8 && vm.newMoment.constellation.length > 4) {
        vm.newMoment.constellation.splice(vm.newMoment.constellation.length - 1, 1);
        createScene(vm.newMoment.constellation);
      } else {
        vm.testVal = false;
      }
    };


    $rootScope.$on("$viewContentLoaded", function(event, toState) {
     if ($state.is('moment.create') || $state.is('moment.show')) {
      scene.remove(cube);
      partitionParams = [];
      constellation = [];
      vm.newMoment = {
      title: "",
      text: "",
      images: [],
      date: "",
      constellation: []
      }
      startConstellation();
     } else if ($state.is('moment')) {
      grabMoments();
      scene.remove(cube);
     }
    })
  };


})();

