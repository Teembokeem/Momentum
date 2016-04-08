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
        createPartitions(numPartitions);
        console.log(partitionParams)
        createRings(numRings);
        console.log(ringParams)
        createConstellation(numBodies);
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
      camera      = new THREE.PerspectiveCamera( 90,  window.innerWidth / window.innerHeight, 0.5, 1500 ),
      renderer    = new THREE.WebGLRenderer(),
      mouseX      = 0,
      mouseY      = 0,
      windowHalfX = window.innerWidth / 2,
      windowHalfY = window.innerHeight / 2;

  //MOMENT CREATION
  vm.testVal = false;
  var rng = function(max, min) {
    return Math.floor((Math.random() * (max - min)) + min )
  }

  var momentApexNadir = [ 100, -100 ];
  var momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1])

  //B. DEFINE POLES
  var momentPoles     = [ 0,  100 ];
  var momentGirth     = momentPoles[1] - momentPoles[0];

  //C. DEFINE PARTITIONS
  var numPartitions = rng(10,0);
  var partitionParams = [];
  var partitionRange;
  function createPartitions(n) {
    for ( var i = 0; i < n + 1; i++ ) {
      partitionParams.push(
        [
          momentApexNadir[1] + (i * (momentRange / ( n+1 ))),
          momentApexNadir[1] + ((i + 1) * (momentRange / ( n+1 )))
        ]
      )
    };
    partitionRange = partitionParams[0][1] - partitionParams[0][0];
  };

  //D. DEFINE RINGS
  var numRings = rng(10, 0);
  var ringParams = [];
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


  //E. "RANDOMLY" CHOOSE SECTOR
  var numBodies = rng(3, 0);
  var constellation = [];
  var quadrantArray = [1, 1, -1, -1]
  function createConstellation(n) {
    for (var i = 0; i < n + 1; i++) {
      var constellationX = rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]);
      constellation.push(
        [
          quadrantArray[i % 4] *         rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]),
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
      // a must be equal to b
      return 0;
    })
  };

  var convexarray = [];
  function createVertices(array) {
    for (var i = 0; i < array.length; i++) {
      convexarray.push(
        new THREE.Vector3( constellation[i][0],  constellation[i][1], constellation[i][2] )
      );
    }
  }


  createPartitions(numPartitions);
  console.log(partitionParams)
  createRings(numRings);
  console.log(ringParams)
  createConstellation(numBodies);
    console.log("your constellation", constellation)
  // prepRadiiArray(constellation);
  // detectRadii(constellation);
    // console.log("log of distances in order", radiiArray)

  //SET UP GEOMETRY CONSTRUCTOR

  var geometry;

  // createFaces(radiiArray, constellation);
  createVertices(constellation);
    // console.log("your faces", geometry.faces, "vertices", geometry.vertices)

  geometry = new THREE.ConvexGeometry( convexarray );


  var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube, light );
  camera.position.z = 300;

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
  }

  function update(a) {
    if (a === true && vm.keyEvent !== 8) {
      var currentRotation = scene.children[0].rotation.y;
      scene.remove(scene.children[0]);

      $log.debug("your scene", scene.children[0])
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
      var geometry = new THREE.ConvexGeometry( convexarray );
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, vertexColors: THREE.FaceColors } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );

      $log.debug("inside update!")
      $log.debug(scene)
      vm.testVal = false;
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
      vm.testVal = !vm.testVal;
      var geometry = new THREE.ConvexGeometry( convexarray );
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, vertexColors: THREE.FaceColors } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );

      $log.debug("inside update!")
      $log.debug(scene)
      vm.testVal = false;
      vm.keyEvent = '';
      scene.children[0].rotation.y = currentRotation;
      scene.children[0].geometry.faces.forEach(function(face) {
        face.vertexColors.push(
          new THREE.Color( 0xff0000 ),
          new THREE.Color( 0xff0000 ),
          new THREE.Color( 0xff0000 )

          )
      })
      // $log.debug("passing over.")
    } else {
      vm.testVal = false;

    }
  }
  requestAnimationFrame(render);
  function render() {
    // $log.debug(geometry)
    requestAnimationFrame( render );
    update(vm.testVal)
    // camera.position.x += ( mouseX - camera.position.x );
    // camera.position.y += ( - mouseY - camera.position.y );
    // camera.lookAt( scene.position );
    scene.children[0].rotation.y += 0.007;    // $log.debug("convex array after:",  convexarray.length)

    // $log.debug("running....", geometry)
    // console.log(cubic-bezier(.17,.67,.83,.67))

    renderer.render( scene, camera );
    document.getElementById("momentum").appendChild(renderer.domElement);
    renderer.setSize( window.innerWidth, window.innerHeight );  }
  };

})();

