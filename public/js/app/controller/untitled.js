 var rng = function(max, min) {
    return Math.floor((Math.random() * (max - min)) + min )
  }

 var momentApexNadir = [ 400, -400 ];
  var momentRange     = momentApexNadir[0] + Math.abs(momentApexNadir[1])

  //B. DEFINE POLES
  var momentPoles     = [ 160,  320 ];
  var momentGirth     = momentPoles[1] - momentPoles[0];

  //C. DEFINE PARTITIONS
  var numPartitions = 3;
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
  var quadrantArray = [1, 1, -1, -1]
  function createConstellation(n) {
    for (var i = 0; i < n + 1; i++) {
      var constellationX = rng(ringParams[i % ringParams.length][1], ringParams[i % ringParams.length][0]);
      constellation.push(
        [
          quadrantArray[i % 4] * constellationX,
          rng(partitionParams[i % partitionParams.length][1], partitionParams[i % partitionParams.length][0]),
          quadrantArray[((i % 2) + 1)] * Math.pow((Math.pow(ringParams[i % ringParams.length][1], 2) - Math.pow(constellationX, 2)) , 0.5)
        ])
    };
  };

  //F. CALCULATE DISTANCES OF LINES FROM POINT A TO POINT B, SELF-EXCLUDED
  var radiiArray = [];
  function prepRadiiArray(array) {
      for ( var i = 0; i < array.length - 1; i++) {
          radiiArray.push([])
      }
  };

  function detectRadii(array) {
    for (var i = 0; i < array.length - 1; i ++) {
     for (var j = 0; j < array.length - 1; j ++) {
      if (i !== j) radiiArray[i].push(
        [
          i,
          j,
          Math.pow(Math.pow( (array[j][0] - array[i][0]) , 2) + Math.pow( (array[j][1] - array[i][1]) , 2) + Math.pow( (array[j][2] - array[i][2]) , 2) , 0.5)
        ]
      );
      }
      radiiArray[i].sort(function(a, b) {
        if (a[2] > b[2]) {
          return 1;
        }
        if (a[2] < b[2]) {
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
detectRadii(constellation)
  console.log(radiiArray)

