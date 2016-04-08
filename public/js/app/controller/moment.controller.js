(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentController", MomentController);

  MomentController.$inject = ["$log", "$http", "$state", "$window", "tokenService", "$rootScope"];

  function MomentController($log, $http, $state, $window, token, $rootScope) {
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
      $state.go("moment" + state, data)
        .then(function() {
          if (state === '.create') {
             angular.element( document.querySelector( '#momentum' ) ).append( renderer.domElement)
          } else {
            $('canvas').remove();
          }

        })
    };

    function updateArray() {
      vm.newMoment.images[vm.accumulator] = vm.newMoment.images[vm.accumulator].substring(0, vm.newMoment.images[vm.accumulator].length - 1);
      vm.accumulator++
    }
    //functions
    function submitMoment(data) {
      $http({
        method: 'POST',
        url: "api/moments",
        data: data
      })
      .then(function(res) {
        transition('.show', {"id": res.data._id})
      })
    };

    function renderMoment(index) {
      vm.momentTemplate = {
        title:  vm.moments[index].title,
        text:   vm.moments[index].text,
        images: vm.moments[index].images,
        date:   vm.moments[index].createdAt
      };
      vm.selectedMoment = vm.moments[index];
      transition('.show', {"id": vm.selectedMoment._id});
    }

    function updateMoment() {
      $http({
        method: "PUT",
        url:    "api/moments/" + vm.selectedMoment._id,
        data:   vm.selectedMoment
      })
      .then(
        function(res) {
          vm.showForm = !vm.showForm;
        }, function(err) {
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
        });
      return promise;
    };


  grabMoments();

//VARIABLES FOR 3D ENVIRONMENT
    vm.testVal = false;
    var scene    = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        camera   = new THREE.PerspectiveCamera( 90,  window.innerWidth / window.innerHeight, 0.5, 1500 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.z = 300;

//VARIABLES FOR CRYSTAL SYNTHESIS
  //A. DEFINE CRYSTAL APEX AND NADIR
  var momentApexNadir = [ 100, -100 ],
      momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1]),

  //B. DEFINE LATERAL POLES
      momentPoles     = [ 0,  100 ],
      momentGirth     = momentPoles[1] - momentPoles[0],
  //C.a Partition vars
      numPartitions   = rng(10,0),
      partitionParams = [],
      partitionRange,
  //D.a Ring vars
      numRings        = rng(10, 0),
      ringParams      = [],
  //E.a Constellation vars
      numBodies       = rng(3, 0),
      constellation   = [],
      quadrantArray   = [1, 1, -1, -1],
  //F.a THREE.js vars
      convexarray     = [],
  //G.a Gemometry vars
      geometry,
      material        = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );

//MOMENT CREATION

  //G.b FUNCTION CALLS
  createPartitions(numPartitions);
  createRings(numRings);
  createConstellation(numBodies);
  createVertices(constellation);
  geometry = new THREE.ConvexGeometry( convexarray );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  requestAnimationFrame(render);


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
            quadrantArray[((i % 2) + 1)] * rng(partitionParams[i % partitionParams.length][1], partitionParams[i % partitionParams.length][0]),
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
        convexarray.push(
          new THREE.Vector3( constellation[i][0],  constellation[i][1], constellation[i][2] )
        );
      }
    }

    //HELPERS
    function rng(max, min) {
      return Math.floor((Math.random() * (max - min)) + min )
    };

    function render() {
      requestAnimationFrame(render);
      update(vm.testVal)
      renderer.render( scene, camera );
      if (document.getElementsByTagName("p") !== undefined) {
        document.getElementById("momentum").appendChild( renderer.domElement)
      }
      scene.children[0].rotation.y += 0.050;
    };

    function update(a) {
      if (a === true && vm.keyEvent !== 8) {
        vm.testVal = false;
        var someVal         = rng(4,0),
            currentRotation = scene.children[0].rotation.y;
        scene.remove(scene.children[0]);

        for (var i = 0; i < 1; i++) {
          var constellationX = rng(momentApexNadir[1], momentApexNadir[0]);
          convexarray.push(
            new THREE.Vector3(
              quadrantArray[someVal % 4] *         rng(momentApexNadir[1], momentApexNadir[0]),
              quadrantArray[((someVal % 2) + 1)] * rng(momentPoles[1], momentPoles[0]),
              quadrantArray[((someVal % 2) + 1)] * Math.pow((Math.pow(momentApexNadir[1], 2) - Math.pow(constellationX, 2)) , 0.5)
            )
          )
        }

        geometry        = new THREE.ConvexGeometry( convexarray );
        material        = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, vertexColors: THREE.FaceColors } );
        cube            = new THREE.Mesh( geometry, material );
        scene.add( cube );
        scene.children[0].rotation.y = currentRotation;
        scene.children[0].geometry.faces.forEach(function(face) {
          face.vertexColors.push(
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 )
          )
        })
      } else if (a === true && vm.keyEvent === 8 && convexarray.length > 4) {
        vm.testVal  = false;
        vm.keyEvent = '';
        var currentRotation = scene.children[0].rotation.y;
        scene.remove(scene.children[0]);
        convexarray.splice(convexarray.length - 1, 1);
        geometry = new THREE.ConvexGeometry( convexarray );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        cube     = new THREE.Mesh( geometry, material );
        scene.add( cube );
        scene.children[0].rotation.y = currentRotation;
        scene.children[0].geometry.faces.forEach(function(face) {
          face.vertexColors.push(
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 )
          )
        })
      } else {
        vm.testVal = false;
      }
    };
  };
})();

