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
      camera      = new THREE.PerspectiveCamera( 90,  window.innerWidth / window.innerHeight, 0.5, 1500 ),
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

 var momentApexNadir = [ 200, -200 ];
  var momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1])

  //B. DEFINE POLES
  var momentPoles     = [ 120,  190 ];
  var momentGirth     = momentPoles[1] - momentPoles[0];

  //C. DEFINE PARTITIONS
  var numPartitions = 50;
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
  var numRings = 50;
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
  var numBodies = 20;
  var constellation = [];
  var quadrantArray = [1, 1, -1, -1]
  function createConstellation(n) {
    for (var i = 0; i < n + 1; i++) {
      var constellationX = rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]);
      constellation.push(
        [
          quadrantArray[i % 4] * rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]),
          quadrantArray[((i % 2) + 1)] * rng(partitionParams[i % partitionParams.length][1], partitionParams[i % partitionParams.length][0]),
          quadrantArray[((i % 2) + 1)] * Math.pow((Math.pow(ringParams[i % ringParams.length][1], 2) - Math.pow(constellationX, 2)) , 0.5)
        ])
    };
    constellation.push([0, momentApexNadir[0], 0])
    constellation.push([0, momentApexNadir[1], 0])
  };

  //F. CALCULATE DISTANCES OF LINES FROM POINT A TO POINT B, SELF-EXCLUDED
  var radiiArray = [];
  function prepRadiiArray(array) {
      for ( var i = 0; i < array.length; i++) {
          radiiArray.push([])
      }
  };

  function detectRadii(array) {
    console.log("constellation in here:", constellation)
    console.log("prep radiiaray in here:", radiiArray)
    for (var i = 0; i < array.length; i ++) {
     for (var j = 0; j < array.length; j ++) {
      if (i !== j) radiiArray[i].push(
        [
          i,
          j,
          Math.pow(Math.pow( (array[j][0] - array[i][0]) , 2) + Math.pow( (array[j][1] - array[i][1]) , 2) + Math.pow( (array[j][2] - array[i][2]) , 2) , 0.5)
        ]
      );
      }
      radiiArray[i].sort(function(a, b) {
        if (Math.abs(a[2]) > Math.abs(b[2])) {
          return 1;
        }
        if (Math.abs(a[2]) < Math.abs(b[2])) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
    };
  }

  // var momentLines = [];
  // function minLines(array) {
  //   for (var i = 0; i < array.length - 1; i++) {
  //     for (var j = 0; i < array.length - 1; i ++) {
  //       momentLines.push(
  //         [
  //           i,
  //           j,
  //           radiiArray[i].sort(function(a, b) {
  //             if (a[2] > b[2]) {
  //               return 1;
  //             }
  //             if (a[2] < b[2]) {
  //               return -1;
  //             }
  //             // a must be equal to b
  //             return 0;
  //           })


  //         ]
  //       )
  //     }
  //   }
  // }

createPartitions(numPartitions);
createRings(numRings);
createConstellation(numBodies);
prepRadiiArray(constellation);
detectRadii(constellation);
createFaces(radiiArray);
createVertices(constellation);
  console.log("log of distances in order", radiiArray)
  console.log("your constellation", constellation)
  console.log("your faces", geometry.faces, "vertices", geometry.vertices)

function createVertices(array) {
  for (var i = 0; i < array.length; i++) {
    geometry.vertices.push(
      new THREE.Vector3( constellation[i][0],  constellation[i][1], constellation[i][2] )
    );
  }
}


function createFaces(array) {
  console.log(array)
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < array[i].length - 1; j++) {
      console.log(array[i][j])
      geometry.faces.push(
        new THREE.Face3(array[array.length - 2 + i][j % array[i].length][0], array[array.length - 2 + i][j % array[i].length][1], array[array.length - 2 + i][j % array[i].length + 1][1])
      );
    }
  }
};


  // geometry.faces.push(
  //    new THREE.Face3( 0, 2, 3 ),
  //    new THREE.Face3( 0, 3, 5 ),
  //    new THREE.Face3( 0, 5, 4 ),
  //    new THREE.Face3( 0, 4, 6 ),
  //    new THREE.Face3( 0, 6, 2 ),
  //    new THREE.Face3( 0, 7, 3 ),
  //    new THREE.Face3( 0, 7, 2 ),
  //    new THREE.Face3( 1, 2, 3 ),
  //    new THREE.Face3( 1, 3, 5 ),
  //    new THREE.Face3( 1, 5, 4 ),
  //    new THREE.Face3( 1, 4, 6 ),
  //    new THREE.Face3( 1, 6, 2 )
  //    );

  var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube, light );
  camera.position.z = 300;

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
    renderer.setSize( window.innerWidth, window.innerHeight );  }
  };

})();

