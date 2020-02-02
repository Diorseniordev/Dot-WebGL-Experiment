var mode = 0;

var scene,
  camera,
  renderer,
  controls,
  clock,
  plane,
  plane1_2,
  selection,
  offset,
  raycaster,
  object1_2,
  p1;

var container, width, height;
var initial_alpha = 22.5,
  initial_beta = 22.5,
  views = [];
for (let alpha = 90 - initial_alpha; alpha > -45; alpha -= initial_alpha) {
  for (let beta = 0; beta < 360; beta += initial_beta) {
    views.push(
      new THREE1.Vector3(
        (
          120 *
          Math.sin((Math.PI * beta) / 180) *
          Math.cos((Math.PI * alpha) / 180)
        ).toFixed(3) * 1,
        (120 * Math.sin((Math.PI * alpha) / 180)).toFixed(3) * 1,
        (
          120 *
          Math.cos((Math.PI * alpha) / 180) *
          Math.cos((Math.PI * beta) / 180)
        ).toFixed(3) * 1
      )
    );
  }
}
// console.log(views);
var selectedView;
var object0, objects, material;

var testResults = [];

function three_disable() {
  if (controls != null) controls.enabled = false;
}

function three_init_cube() {
  container = $("#cubeDiv");
  width = container.width();
  height = container.height();

  scene = new THREE1.Scene();
  camera = new THREE1.PerspectiveCamera(45, width / height, 1, 1000);
  scene.add(camera);
  camera.position.set(0, 50, 100);
  camera.lookAt(new THREE1.Vector3(0, 0, 0));

  renderer = new THREE1.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  scene.add(new THREE1.AmbientLight(0x444444));
  var dirLight = new THREE1.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 100).normalize();
  camera.add(dirLight);
  camera.add(dirLight.target);

  container.append(renderer.domElement);

  object0 = new THREE1.Mesh(
    new THREE1.CubeGeometry(20, 20, 20),
    new THREE1.MeshPhongMaterial({ color: 0xff00ff })
  );
  scene.add(object0);
}

function three_render_cube() {
  if (mode != 1) return;
  requestAnimationFrame(three_render_cube);
  object0.rotation.y -= 0.01;
  renderer.render(scene, camera);
}

function three_play_cube() {
  mode = 1;
  three_init_cube();
  three_render_cube();
}

function three_init_test() {
  container = $("#testDiv");
  width = container.width();
  height = container.height();
  // console.log(views);
  container.find("canvas").remove();
  // container.hide();

  scene = new THREE1.Scene();
  camera = new THREE1.PerspectiveCamera(45, width / height, 1, 1000);
  scene.add(camera);
  selectedView = Math.floor(Math.random() * views.length);
  let pos = views[selectedView];
  console.log(selectedView);
  camera.userData = {
    selectedView: selectedView,
    views: views,
    viewedCount: Array(views.length).fill(0),
    viewedTime: Array(views.length).fill(0),
    viewedAxis: 0,
    viewedOrder: [],
    startView: Date.now()
  };
  // console.log(selectedView);
  camera.position.set(pos.x, pos.y, pos.z);

  camera.lookAt(new THREE1.Vector3(0, 0, 0));

  renderer = new THREE1.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  scene.add(new THREE1.AmbientLight(0x444444));
  var dirLight = new THREE1.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 100).normalize();
  camera.add(dirLight);
  camera.add(dirLight.target);

  if (controls != null) controls.enabled = false;
  controls = new THREE1.OrbitControls(camera);
  controls.target = new THREE1.Vector3(0, 0, 0);
  controls.maxDistance = 150;

  clock = new THREE1.Clock();

  plane = new THREE1.Mesh(
    new THREE1.PlaneBufferGeometry(500, 500, 8, 8),
    new THREE1.MeshBasicMaterial({ color: 0xffffff })
  );
  plane.visible = false;
  scene.add(plane);

  var cbgeometry = new THREE1.PlaneGeometry(50, 50, 8, 8),
    cbmaterials = [];
  cbmaterials.push(
    new THREE1.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE1.DoubleSide,
      opacity: 0.7,
      transparent: true
    })
  );
  cbmaterials.push(
    new THREE1.MeshBasicMaterial({
      color: 0xaaaaaa,
      side: THREE1.DoubleSide,
      opacity: 0.7,
      transparent: true
    })
  );

  for (var i = 0; i < cbgeometry.faces.length / 2; i++) {
    cbgeometry.faces[i * 2].materialIndex = (i + Math.floor(i / 8)) % 2;
    cbgeometry.faces[i * 2 + 1].materialIndex = (i + Math.floor(i / 8)) % 2;
  }

  plane1_2 = new THREE1.Mesh(
    cbgeometry,
    new THREE1.MeshFaceMaterial(cbmaterials)
  );
  plane1_2.rotation.x = Math.PI / 2;
  plane1_2.position.y = -22;
  scene.add(plane1_2);

  container.append(renderer.domElement);

  material = new THREE1.MeshPhongMaterial({ color: 0xff00ff });
  material.transparent = true;
  material.opacity = 0.5;
  material.wireframe = false;

  objects = [];

  p1 = {
    x: Math.floor(Math.random() * 12) - 5.5,
    y: Math.floor(Math.random() * 46) - 15,
    z: Math.floor(Math.random() * 12) - 5.5
  };
  p1.x += p1.x > 0 ? 24.5 : -24.5;
  p1.z += p1.z > 0 ? 24.5 : -24.5;

  // var p2 = {
  //   x: Math.floor(Math.random() * 12) - 5.5,
  //   y: Math.floor(Math.random() * 46) - 15,
  //   z: Math.floor(Math.random() * 12) - 5.5
  // };
  // p2.x += p2.x > 0 ? 24.5 : -24.5;
  // p2.z += p2.z > 0 ? 24.5 : -24.5;

  // console.log(p1);
  // console.log(p2);

  // testResults[testResults.length - 1].startPosition2 = p2;

  var material2 = new THREE1.MeshPhongMaterial({ color: 0x00ff00 });
  object1_2 = new THREE1.Mesh(new THREE1.SphereGeometry(2, 10, 10), material2);
  object1_2.position.set(p1.x, p1.y, p1.z);
  objects.push(object1_2);
  scene.add(object1_2);

  // var material3 = new THREE1.MeshPhongMaterial({ color: 0xffff00 });
  // var object3 = new THREE1.Mesh(new THREE1.SphereGeometry(2, 10, 10), material3);
  // object3.position.set(p2.x, p2.y, p2.z);
  // objects.push(object3);
  // scene.add(object3);

  offset = new THREE1.Vector3();
  raycaster = new THREE1.Raycaster();

  container.fadeIn();
  addMouseEvent();

  // $("#btn3dWireframe").click(function () {
  //   if (mode != modeFlag) return;
  //   object0.material.wireframe = !object0.material.wireframe;
  // });
}
function addMouseEvent(modeFlag) {
  container.mousedown(function(event) {
    if (mode != modeFlag) return;

    var mouseX = ((event.pageX - container.offset().left) / width) * 2 - 1;
    var mouseY = -((event.pageY - container.offset().top) / height) * 2 + 1;

    var vector = new THREE1.Vector3(mouseX, mouseY, 1);
    vector.unproject(camera);

    raycaster.set(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
      controls.enabled = false;
      selection = intersects[0].object;

      var intersects = raycaster.intersectObject(plane);
      offset.copy(intersects[0].point).sub(plane.position);
    }
  });

  container.mousemove(function(event) {
    if (mode != modeFlag) return;
    event.preventDefault();

    var mouseX = ((event.pageX - container.offset().left) / width) * 2 - 1;
    var mouseY = -((event.pageY - container.offset().top) / height) * 2 + 1;

    var vector = new THREE1.Vector3(mouseX, mouseY, 1);
    vector.unproject(camera);

    raycaster.set(camera.position, vector.sub(camera.position).normalize());

    if (selection) {
      var intersects = raycaster.intersectObject(plane);
      selection.position.copy(intersects[0].point.sub(offset));
    } else {
      var intersects = raycaster.intersectObjects(objects);
      if (intersects.length > 0) {
        plane.position.copy(intersects[0].object.position);
        plane.lookAt(camera.position);
      }
    }
  });

  container.mouseup(function() {
    if (mode != modeFlag) return;
    controls.enabled = true;
    selection = null;
  });
}
function three_init_test_sphere(onComplete) {
  addMouseEvent(21);

  object0 = new THREE1.Mesh(new THREE1.SphereGeometry(20, 24, 24), material);
  object0.position.set(0, 0, 0);
  object0.name = "sphere";
  // console.log(object0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 21) return;

    var d0 = Math.sqrt(
      objects[0].position.x * objects[0].position.x +
        objects[0].position.y * objects[0].position.y +
        objects[0].position.z * objects[0].position.z
    );
    // ),
    // d1 = Math.sqrt(
    //   objects[1].position.x * objects[1].position.x +
    //     objects[1].position.y * objects[1].position.y +
    //     objects[1].position.z * objects[1].position.z
    // );

    var valid0 = d0 < 18;
    // , valid1 = d1 < 18;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
      if(!valid0) alertMX("Dot is outside the shape");
    // if (valid0 && valid1 && onComplete != null) {
    if (valid0 && onComplete != null) {
      onComplete();
    }
  });
}

function three_render_test_sphere() {
  if (mode != 21) return;
  requestAnimationFrame(three_render_test_sphere);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_sphere(onComplete) {
  mode = 21;
  console.log("three-test");
  three_init_test_sphere(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_sphere();
  }, 500);
}

function three_init_test_cube(onComplete) {
  addMouseEvent(22);

  object0 = new THREE1.Mesh(
    new THREE1.BoxGeometry(32, 32, 32, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 22) return;

    var valid0 =
      objects[0].position.x < 14 &&
      objects[0].position.x > -14 &&
      objects[0].position.y < 14 &&
      objects[0].position.y > -14 &&
      objects[0].position.z < 14 &&
      objects[0].position.z > -14;
    //   ,
    // valid1 =
    //   objects[1].position.x < 14 &&
    //   objects[1].position.x > -14 &&
    //   objects[1].position.y < 14 &&
    //   objects[1].position.y > -14 &&
    //   objects[1].position.z < 14 &&
    //   objects[1].position.z > -14;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_cube() {
  if (mode != 22) return;
  requestAnimationFrame(three_render_test_cube);

  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_cube(onComplete) {
  mode = 22;
  three_init_test_cube(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_cube();
  }, 500);
}

function three_init_test_pyramid(onComplete) {
  addMouseEvent(23);

  object0 = new THREE1.Mesh(
    new THREE1.CylinderGeometry(0, 25, 40, 4, 16),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 23) return;

    var valid0 = objects[0].position.y < 18 && objects[0].position.y > -18;
    //   ,
    // valid1 = objects[1].position.y < 18 && objects[1].position.y > -18;

    var validR0 = (((20 - objects[0].position.y) * 25) / 40 - 2) * Math.SQRT1_2;
    // ,
    //   validR1 = ((20 - objects[1].position.y) * 25) / 40 - 1;

    valid0 =
      valid0 &&
      objects[0].position.x < validR0 &&
      objects[0].position.x > -validR0 &&
      objects[0].position.z < validR0 &&
      objects[0].position.z > -validR0;
    // objects[0].position.x + objects[0].position.z < validR0 &&
    // objects[0].position.x + objects[0].position.z > -validR0 &&
    // objects[0].position.x - objects[0].position.z < validR0 &&
    // objects[0].position.x - objects[0].position.z > -validR0;
    // valid1 =
    //   valid1 &&
    //   objects[1].position.x + objects[1].position.z < validR1 &&
    //   objects[1].position.x + objects[1].position.z > -validR1 &&
    //   objects[1].position.x - objects[1].position.z < validR1 &&
    //   objects[1].position.x - objects[1].position.z > -validR1;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_pyramid() {
  if (mode != 23) return;
  requestAnimationFrame(three_render_test_pyramid);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_pyramid(onComplete) {
  mode = 23;
  three_init_test_pyramid(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_pyramid();
  }, 500);
}

function three_init_test_rectprism1(onComplete) {
  addMouseEvent(241);

  object0 = new THREE1.Mesh(
    new THREE1.BoxGeometry(28, 40, 28, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 241) return;

    var valid0 =
      objects[0].position.x < 12 &&
      objects[0].position.x > -12 &&
      objects[0].position.y < 18 &&
      objects[0].position.y > -18 &&
      objects[0].position.z < 12 &&
      objects[0].position.z > -12;
    //   ,
    // valid1 =
    //   objects[1].position.x < 12 &&
    //   objects[1].position.x > -12 &&
    //   objects[1].position.y < 18 &&
    //   objects[1].position.y > -18 &&
    //   objects[1].position.z < 12 &&
    //   objects[1].position.z > -12;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_rectprism1() {
  if (mode != 241) return;
  requestAnimationFrame(three_render_test_rectprism1);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_rectprism1(onComplete) {
  mode = 241;
  three_init_test_rectprism1(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_rectprism1();
  }, 500);
}

function three_init_test_rectprism2(onComplete) {
  addMouseEvent(242);

  object0 = new THREE1.Mesh(
    new THREE1.BoxGeometry(40, 28, 28, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 242) return;

    var valid0 =
      objects[0].position.x < 18 &&
      objects[0].position.x > -18 &&
      objects[0].position.y < 12 &&
      objects[0].position.y > -12 &&
      objects[0].position.z < 12 &&
      objects[0].position.z > -12;
    //   ,
    // valid1 =
    //   objects[1].position.x < 18 &&
    //   objects[1].position.x > -18 &&
    //   objects[1].position.y < 12 &&
    //   objects[1].position.y > -12 &&
    //   objects[1].position.z < 12 &&
    //   objects[1].position.z > -12;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_rectprism2() {
  if (mode != 242) return;
  requestAnimationFrame(three_render_test_rectprism2);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_rectprism2(onComplete) {
  mode = 242;
  three_init_test_rectprism2(onComplete);
  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_rectprism2();
  }, 500);
}

function three_init_test_cylinder1(onComplete) {
  addMouseEvent(251);

  object0 = new THREE1.Mesh(
    new THREE1.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 251) return;

    var valid0 = objects[0].position.y < 18 && objects[0].position.y > -18;
    //   ,
    // valid1 = objects[1].position.y < 18 && objects[1].position.y > -18;

    var d0 = Math.sqrt(
      objects[0].position.x * objects[0].position.x +
        objects[0].position.z * objects[0].position.z
    );
    // ,
    // d1 = Math.sqrt(
    //   objects[1].position.x * objects[1].position.x +
    //     objects[1].position.z * objects[1].position.z
    // );

    valid0 = valid0 && d0 < 14;
    // valid1 = valid1 && d1 < 14;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_cylinder1() {
  if (mode != 251) return;
  requestAnimationFrame(three_render_test_cylinder1);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_cylinder1(onComplete) {
  mode = 251;
  three_init_test_cylinder1(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_cylinder1();
  }, 500);
}

function three_init_test_cylinder2(onComplete) {
  addMouseEvent(252);

  object0 = new THREE1.Mesh(
    new THREE1.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  object0.rotateZ(-Math.PI * 0.5);
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 252) return;

    var valid0 = objects[0].position.x < 18 && objects[0].position.x > -18;
    //   ,
    // valid1 = objects[1].position.x < 18 && objects[1].position.x > -18;

    var d0 = Math.sqrt(
      objects[0].position.y * objects[0].position.y +
        objects[0].position.z * objects[0].position.z
    );
    // ,
    // d1 = Math.sqrt(
    //   objects[1].position.y * objects[1].position.y +
    //     objects[1].position.z * objects[1].position.z
    // );

    valid0 = valid0 && d0 < 14;
    // valid1 = valid1 && d1 < 14;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    // var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    // $("#testResult").html(msg);
    if(!valid0) alertMX("Dot is outside the shape");
    if (valid0 && onComplete != null) {
      // testResults[testResults.length - 1].endPosition1 = objects[0].position;
      // testResults[testResults.length - 1].endPosition2 = objects[1].position;
      onComplete();
    }
  });
}

function three_render_test_cylinder2() {
  if (mode != 252) return;
  requestAnimationFrame(three_render_test_cylinder2);
  renderScene();
  // controls.update(clock.getDelta());
}

function three_play_test_cylinder2(onComplete) {
  mode = 252;
  three_init_test_cylinder2(onComplete);

  setTimeout(() => {
    trial_start = Date.now();
    three_render_test_cylinder2();
  }, 500);
}
function renderScene() {
  object0.visible = true;
  object1_2.visible = true;
  plane1_2.visible = true;

  renderer.render(scene, camera);
}
