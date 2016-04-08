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
          $log.debug("where are you moment...", document.getElementById("momentum"))
          if (state === '.create') {
             angular.element( document.querySelector( '#momentum' ) ).append( renderer.domElement)
          } else {
            $('canvas').remove();
          }

        })
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
        title:  vm.moments[index].title,
        text:   vm.moments[index].text,
        images: vm.moments[index].images,
        date:   vm.moments[index].createdAt
      };
      vm.selectedMoment = vm.moments[index];
      $log.debug("your selected div:", vm.momentTemplate);
      transition('.show', {"id": vm.selectedMoment._id});
    }

    function updateMoment() {
      $log.debug(vm.selectedMoment)
      $http({
        method: "PUT",
        url:    "api/moments/" + vm.selectedMoment._id,
        data:   vm.selectedMoment
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
      momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1])

  //B. DEFINE LATERAL POLES
  var momentPoles     = [ 0,  100 ];
  var momentGirth     = momentPoles[1] - momentPoles[0];
  //C.a Partition vars
  var numPartitions   = rng(10,0);
  var partitionParams = [];
  var partitionRange;
  //D.a Ring vars
  var numRings = rng(10, 0);
  var ringParams = [];
  //E.a Constellation vars
  var numBodies = rng(3, 0);
  var constellation = [];
  var quadrantArray = [1, 1, -1, -1]
  //F.a THREE.js vars
  var convexarray = [];
  //G.a Gemometry ars
  var geometry;
  var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );

//MOMENT CREATION
  function rng(max, min) {
    return Math.floor((Math.random() * (max - min)) + min )
  };

  function render() {
    requestAnimationFrame(render);
    update(vm.testVal)
    renderer.render( scene, camera );
    // $log.info(cube.rotation.y)
    // $log.debug(".....");
    if (document.getElementsByTagName("p") !== undefined) {
      document.getElementById("momentum").appendChild( renderer.domElement)
    }
    scene.children[0].rotation.y += 0.050;
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


    createPartitions(numPartitions);
    createRings(numRings);
    createConstellation(numBodies);
    createVertices(constellation);

    //G.b CREATE GEOMETRY INSTANCE
    geometry = new THREE.ConvexGeometry( convexarray );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    requestAnimationFrame(render);

    function update(a) {
      if (a === true && vm.keyEvent !== 8) {
        var currentRotation = scene.children[0].rotation.y;
        $log.debug("your scene", scene.children[0])
        scene.remove(scene.children[0]);

        var someVal = rng(4,0);
              $log.debug("convex array before:", convexarray.length)

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
        $log.debug("convex array after:",  convexarray.length)
        geometry     = new THREE.ConvexGeometry( convexarray );
        var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, vertexColors: THREE.FaceColors } );
        var cube     = new THREE.Mesh( geometry, material );
        scene.add( cube );

        $log.debug("inside update!")
        $log.debug(scene)
        vm.testVal = false;
        $log.debug(scene.children)
        scene.children[0].rotation.y = currentRotation;
        scene.children[0].geometry.faces.forEach(function(face) {
          face.vertexColors.push(
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 ),
            new THREE.Color( 0xff0000 )
            )
        })
      } else if (a === true && vm.keyEvent === 8 && convexarray.length > 4) {

        var currentRotation = scene.children[0].rotation.y;
        scene.remove(scene.children[0]);
        $log.debug("convex array before:", convexarray, convexarray.length)
        convexarray.splice(convexarray.length - 1, 1);
        $log.debug("convex array before:", convexarray, convexarray.length)
        vm.testVal   = !vm.testVal;
        var geometry = new THREE.ConvexGeometry( convexarray );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var cube     = new THREE.Mesh( geometry, material );
        scene.add( cube );

        $log.debug("inside update!")
        $log.debug(scene)
        vm.testVal  = false;
        vm.keyEvent = '';
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
    }
  };
})();

