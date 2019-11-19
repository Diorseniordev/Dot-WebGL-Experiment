/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
// This is a drop-in replacement for (most) TrackballControls used in examples.
// That is, include this js file and wherever you see:
//    	controls = new THREE.TrackballControls( camera );
//      controls.target.z = 150;
// Simple substitute "OrbitControls" and the control should work as-is.

THREE.OrbitControls = function(object, domElement) {
  this.object = object;
  this.domElement = domElement !== undefined ? domElement : document;
  this.object.rotationAutoUpdate = false;
  // API

  // Set to false to disable this control
  this.enabled = true;
  var viewtemp = this.object.userData.views;
  // "target" sets the location of focus, where the control orbits around
  // and where it pans with respect to.
  this.target = new THREE.Vector3();
  // center is old, deprecated; use "target" instead
  this.center = this.target;

  // Limits to how far you can dolly in and out
  this.minDistance = 0;
  this.maxDistance = Infinity;

  // Set to true to disable this control
  this.noRotate = true;
  this.rotateSpeed = 1.0;

  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  this.minPolarAngle = 0; // radians
  this.maxPolarAngle = Math.PI; // radians

  ////////////
  // internals

  var scope = this;

  var EPS = 0.000001;

  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();

  var phiDelta = 0;
  var thetaDelta = 0;
  var scale = 1;
  var distArr = [];
  var lastPosition = new THREE.Vector3();

  var STATE = {
    NONE: -1,
    ROTATE: 0
  };
  var state = STATE.NONE;

  // events

  var changeEvent = { type: "change" };

  this.update = function() {
    var originalView = this.object.userData.selectedView;
    var position = this.object.position;
    var offset = position.clone().sub(this.target);

    // angle from z-axis around y-axis
    var theta = Math.atan2(offset.x, offset.z);

    // angle from y-axis
    var phi = Math.atan2(
      Math.sqrt(offset.x * offset.x + offset.z * offset.z),
      offset.y
    );
    theta += thetaDelta;
    phi += phiDelta;

    // restrict phi to be between desired limits
    phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
    // restrict phi to be betwee EPS and PI-EPS
    phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

    var radius = offset.length() * scale;
    // restrict radius to be between desired limits
    radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

    // move target to panned location
    // this.target.add(pan);

    offset.x = radius * Math.sin(phi) * Math.sin(theta);
    offset.y = radius * Math.cos(phi);
    offset.z = radius * Math.sin(phi) * Math.cos(theta);

    position.copy(this.target).add(offset);

    this.object.lookAt(this.target);
    // this.object.position.set(0, 55, 100);

    // console.log(this);
    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;
    let normal;
    let orbviews = [];
    for (let i = 0; i < 18; i++) {
      var temp = new THREE.Vector3(0, 0, 0);
      temp.x = viewtemp[i].x;
      temp.y = viewtemp[i].y;
      temp.z = viewtemp[i].z;
      orbviews[i] = temp;
    }
    for (i = 0; i < 18; i++) {
      if (i != this.object.userData.selectedView) {
        normal = position
          .clone()
          .sub(orbviews[this.object.userData.selectedView])
          .normalize();
        distArr[i] = normal
          .multiplyScalar(
            orbviews[i]
              .sub(orbviews[this.object.userData.selectedView])
              .dot(normal)
          )
          .add(orbviews[this.object.userData.selectedView])
          .sub(orbviews[i])
          .length();
      } else {
        distArr[i] = 0;
      }
    }

    let mindist = distArr[0];
    this.object.userData.selectedView = 0;
    for (i = 1; i < 18; i++) {
      if (mindist == 0) {
        mindist = distArr[i];
        this.object.userData.selectedView = 1;
      } else if (mindist > distArr[i] && distArr[i] != 0) {
        mindist = distArr[i];
        this.object.userData.selectedView = i;
      }
    }

    let newPos = viewtemp[this.object.userData.selectedView];
    if (
      this.object.userData.viewedCount[this.object.userData.selectedView] == 0
    ) {
      this.object.userData.viewedCount[this.object.userData.selectedView]++;
      this.object.userData.viewedAxis++;
    } else {
      this.object.userData.viewedCount[this.object.userData.selectedView]++;
    }
    console.log(this.object.userData);
    position.copy(this.target).add(newPos);

    this.object.lookAt(this.target);
    // this.object.position.x = newPos.x;
    // this.object.position.y = newPos.y;
    // this.object.position.z = newPos.z;
    // position.copy(this.target).add(newPos);
    if (lastPosition.distanceTo(this.object.position) > 0) {
      if (
        !this.object.userData.viewedOrder.includes(
          this.object.userData.selectedView
        )
      ) {
        this.object.userData.viewedOrder.push(
          this.object.userData.selectedView
        );
      }
      this.object.userData.viewedTime[originalView] +=
        ((Date.now() - this.object.userData.startView) / 1000).toFixed(3) * 1;
      this.object.userData.startView = Date.now();
      this.dispatchEvent(changeEvent);
      lastPosition.copy(this.object.position);
    }
    //console.log(lastPosition);
  };

  function getAutoRotationAngle() {
    return ((2 * Math.PI) / 60 / 60) * scope.autoRotateSpeed;
  }

  function onMouseDown(event) {
    if (scope.enabled === false) {
      return;
    }
    event.preventDefault();

    if (event.button === 0) {
      state = STATE.ROTATE;

      rotateStart.set(event.clientX, event.clientY);
    }

    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be

    scope.domElement.addEventListener("mouseup", onMouseUp, false);
  }

  function onMouseUp(/* event */) {
    if (scope.enabled === false) return;
    var element =
      scope.domElement === document ? scope.domElement.body : scope.domElement;

    if (state === STATE.ROTATE) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart);
      thetaDelta = (2 * Math.PI * rotateDelta.x) / element.clientWidth;
      phiDelta = (2 * Math.PI * rotateDelta.y) / element.clientHeight;
      // rotating across whole screen goes 360 degrees around

      rotateStart.copy(rotateEnd);
    }
    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
    scope.update();
    // Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be

    scope.domElement.removeEventListener("mouseup", onMouseUp, false);

    state = STATE.NONE;
  }

  this.domElement.addEventListener(
    "contextmenu",
    function(event) {
      event.preventDefault();
    },
    false
  );
  this.domElement.addEventListener("mousedown", onMouseDown, false);
};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
