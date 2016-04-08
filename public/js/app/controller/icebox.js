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




  //G CREATE VERTICES AND FACES
  function createFaces(arr1, arr2) {
    // console.log(array)
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < arr1[i].length - 1; j++) {
        console.log(arr1[i][j][0], "should be equal to", arr2[arr1[i][j][0]])
        geometry.faces.push(
          new THREE.Face3(arr1[arr1.length - 2 + i][j % arr1[i].length][0], arr1[arr1.length - 2 + i][j % arr1[i].length][1], arr1[arr1.length - 2 + i][j % arr1[i].length + 1][1])
        );
      }
    }
  };

prepRadiiArray(constellation);
detectRadii(constellation);
console.log("log of distances in order", radiiArray)
// createFaces(radiiArray, constellation);
