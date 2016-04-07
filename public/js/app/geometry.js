//RANDOMIZER UTILITY
  function rng(max, min, bool) {
    if (bool) return Math.floor((Math.random() * (max - min)) + min);
    else return (Math.random() * (max - min)) + min;
  };

  //MOMENT VARIABLES
    //ensures, width is is never the height: no squares
  var momentFactor    = rng(0.75, 0.5, false);
    //defines bounding vertices for the gem (y-direction)
  var momentApexNadir = [ rng(200, 100, true), -(rng(200, 100, true)) ];
    //defines outermost bound along the length of the moment
  var momentPole      = Math.floor(momentApexNadir[0] * momentFactor);
    //TODO: need to sengment momentPole into n sections and push randomly into array, tRings argument should end up being num
  var tRings = [];
  function tRingsGenerator() {
    tRings.push(rng(5))
  }

  console.log(tRings)

  $log.debug("your apex and nadir:", momentApexNadir)
  $log.debug("your pole:", momentPole)

  function boundingCircles(squaredRadius) {
    $log.info("Creating our paired coordinates")
    var x = rng(squaredRadius, 0, true);
    $log.info("Randomized x value: should be greater than 0 and less than " + squaredRadius + ":", x);
    var z = (function(compCoordinate) {
      var num;
      return num > Math.pow(((momentPole / 5) + (momentPole / 5) / 3) - x, 0.5 ) &&
    })
    $log.info("Randomized x value: should be greater than 0 and less than " + squaredRadius + ":", x);

  }


  var points = [
    new THREE.Vector3(   0,  100,   0 ),
    new THREE.Vector3(   0, -100,   0 ),
    new THREE.Vector3(  8 * Math.pow(2, 0.5), 0, 8 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   -8 * Math.pow(2, 0.5), 0,  8 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   0, 0,   16 ),
    new THREE.Vector3(  10 * Math.pow(2, 0.5), 0, 10 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   -10 * Math.pow(2, 0.5), 0,  10 * Math.pow(2, 0.5) ),
    new THREE.Vector3(   0, 0,   20 ),
    new THREE.Vector3(   0, 40, 14 )

    // new THREE.Vector3(   -momentPole, -rng(momentApexNadir[0] - 20, momentApexNadir[0] - 50, true),   momentPole ),
    // new THREE.Vector3(   momentPole, -rng(momentApexNadir[0] - 20, momentApexNadir[0] - 50, true),   -momentPole ),
    // new THREE.Vector3(   -momentPole, rng(momentApexNadir[0] - 50, momentApexNadir[0] - 40, true),   -momentPole ),
    // new THREE.Vector3(   momentPole, rng(momentApexNadir[0] - 80, momentApexNadir[0] - 80, true),   momentPole ),
    // new THREE.Vector3(   -momentPole, -rng(momentApexNadir[0] -  50, momentApexNadir[0] -70, true),   momentPole ),
    // new THREE.Vector3(   momentPole, -rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   -momentPole ),
    // new THREE.Vector3(   -momentPole, rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   -momentPole ),
    // new THREE.Vector3(   momentPole, rng(momentApexNadir[0] - 100, momentApexNadir[0] - 120, true),   momentPole )
  ];

  console.log("your vertices:", geometry.vertices[2], geometry.vertices[3], geometry.vertices[4], geometry.vertices[5])



  geometry.computeBoundingSphere();

  geometry = new THREE.ConvexGeometry( points );
