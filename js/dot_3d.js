var mode = 0;

var scene,
  camera,
  renderer,
  controls,
  clock,
  plane,
  selection,
  offset,
  raycaster,
  p1;

var container, width, height;
var views = [
  new THREE.Vector3(120, 0, 0),
  new THREE.Vector3(-120, 0, 0),
  new THREE.Vector3(0, 120, 0),
  new THREE.Vector3(0, -120, 0),
  new THREE.Vector3(0, 0, 120),
  new THREE.Vector3(0, 0, -120),
  new THREE.Vector3(120 * Math.SQRT1_2, 120 * Math.SQRT1_2, 0),
  new THREE.Vector3(-120 * Math.SQRT1_2, 120 * Math.SQRT1_2, 0),
  new THREE.Vector3(120 * Math.SQRT1_2, -120 * Math.SQRT1_2, 0),
  new THREE.Vector3(-120 * Math.SQRT1_2, -120 * Math.SQRT1_2, 0),
  new THREE.Vector3(0, 120 * Math.SQRT1_2, 120 * Math.SQRT1_2),
  new THREE.Vector3(0, -120 * Math.SQRT1_2, 120 * Math.SQRT1_2),
  new THREE.Vector3(0, 120 * Math.SQRT1_2, -120 * Math.SQRT1_2),
  new THREE.Vector3(0, -120 * Math.SQRT1_2, -120 * Math.SQRT1_2),
  new THREE.Vector3(120 * Math.SQRT1_2, 0, 120 * Math.SQRT1_2),
  new THREE.Vector3(-120 * Math.SQRT1_2, 0, 120 * Math.SQRT1_2),
  new THREE.Vector3(120 * Math.SQRT1_2, 0, -120 * Math.SQRT1_2),
  new THREE.Vector3(-120 * Math.SQRT1_2, 0, -120 * Math.SQRT1_2)
];

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

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  scene.add(camera);
  camera.position.set(0, 50, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  scene.add(new THREE.AmbientLight(0x444444));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 100).normalize();
  camera.add(dirLight);
  camera.add(dirLight.target);

  container.append(renderer.domElement);

  object0 = new THREE.Mesh(
    new THREE.CubeGeometry(20, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0xff00ff })
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

function three_init_test(modeFlag) {
  container = $("#testDiv");
  width = container.width();
  height = container.height();
  // console.log(views);
  container.find("canvas").remove();
  container.hide();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  scene.add(camera);
  selectedView = Math.floor(Math.random() * 18);
  let pos = views[selectedView];
  camera.userData = {
    selectedView: selectedView,
    views: views,
    viewedCount: Array(18).fill(0),
    viewedTime: Array(18).fill(0),
    viewedAxis: 0,
    viewedOrder: [],
    startView: Date.now()
  };
  // console.log(selectedView);
  camera.position.set(pos.x, pos.y, pos.z);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  scene.add(new THREE.AmbientLight(0x444444));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 100).normalize();
  camera.add(dirLight);
  camera.add(dirLight.target);

  if (controls != null) controls.enabled = false;
  controls = new THREE.OrbitControls(camera);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.maxDistance = 150;

  clock = new THREE.Clock();

  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(500, 500, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  plane.visible = false;
  scene.add(plane);

  var cbgeometry = new THREE.PlaneGeometry(50, 50, 8, 8),
    cbmaterials = [];
  cbmaterials.push(
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  cbmaterials.push(
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
  );

  for (var i = 0; i < cbgeometry.faces.length / 2; i++) {
    cbgeometry.faces[i * 2].materialIndex = (i + Math.floor(i / 8)) % 2;
    cbgeometry.faces[i * 2 + 1].materialIndex = (i + Math.floor(i / 8)) % 2;
  }

  var plane2 = new THREE.Mesh(
    cbgeometry,
    new THREE.MeshFaceMaterial(cbmaterials)
  );
  plane2.rotation.x = Math.PI / 2;
  plane2.position.y = -22;
  // scene.add(plane2);

  container.append(renderer.domElement);

  material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
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

  var material2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  var object2 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material2);
  object2.position.set(p1.x, p1.y, p1.z);
  objects.push(object2);
  scene.add(object2);

  // var material3 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  // var object3 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material3);
  // object3.position.set(p2.x, p2.y, p2.z);
  // objects.push(object3);
  // scene.add(object3);

  offset = new THREE.Vector3();
  raycaster = new THREE.Raycaster();

  container.fadeIn();

  container.mousedown(function(event) {
    if (mode != modeFlag) return;

    var mouseX = ((event.pageX - container.offset().left) / width) * 2 - 1;
    var mouseY = -((event.pageY - container.offset().top) / height) * 2 + 1;

    var vector = new THREE.Vector3(mouseX, mouseY, 1);
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

    var vector = new THREE.Vector3(mouseX, mouseY, 1);
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

  // $("#btn3dWireframe").click(function () {
  //   if (mode != modeFlag) return;
  //   object0.material.wireframe = !object0.material.wireframe;
  // });
}

function three_init_test_sphere(onComplete) {
  three_init_test(21);

  object0 = new THREE.Mesh(new THREE.SphereGeometry(20, 24, 24), material);
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

    var valid0 = d0 < 18.25;
    // , valid1 = d1 < 18.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

    // if (valid0 && valid1 && onComplete != null) {
    if (valid0 && onComplete != null) {
      onComplete();
    }
  });
}

function three_render_test_sphere() {
  if (mode != 21) return;
  requestAnimationFrame(three_render_test_sphere);
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_sphere(onComplete) {
  mode = 21;
  console.log("three-test");
  three_init_test_sphere(onComplete);
  three_render_test_sphere();
}

function three_init_test_cube(onComplete) {
  three_init_test(22);

  object0 = new THREE.Mesh(
    new THREE.BoxGeometry(32, 32, 32, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 22) return;

    var valid0 =
      objects[0].position.x < 14.25 &&
      objects[0].position.x > -14.25 &&
      objects[0].position.y < 14.25 &&
      objects[0].position.y > -14.25 &&
      objects[0].position.z < 14.25 &&
      objects[0].position.z > -14.25;
    //   ,
    // valid1 =
    //   objects[1].position.x < 14.25 &&
    //   objects[1].position.x > -14.25 &&
    //   objects[1].position.y < 14.25 &&
    //   objects[1].position.y > -14.25 &&
    //   objects[1].position.z < 14.25 &&
    //   objects[1].position.z > -14.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_cube(onComplete) {
  mode = 22;
  three_init_test_cube(onComplete);
  three_render_test_cube();
}

function three_init_test_pyramid(onComplete) {
  three_init_test(23);

  object0 = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 25, 40, 4, 16),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 23) return;

    var valid0 =
      objects[0].position.y < 18.25 && objects[0].position.y > -18.25;
    //   ,
    // valid1 = objects[1].position.y < 18.25 && objects[1].position.y > -18.25;

    var validR0 = ((20 - objects[0].position.y) * 25) / 40 - 1;
    // ,
    //   validR1 = ((20 - objects[1].position.y) * 25) / 40 - 1;

    valid0 =
      valid0 &&
      objects[0].position.x + objects[0].position.z < validR0 &&
      objects[0].position.x + objects[0].position.z > -validR0 &&
      objects[0].position.x - objects[0].position.z < validR0 &&
      objects[0].position.x - objects[0].position.z > -validR0;
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
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_pyramid(onComplete) {
  mode = 23;
  three_init_test_pyramid(onComplete);
  three_render_test_pyramid();
}

function three_init_test_rectprism1(onComplete) {
  three_init_test(241);

  object0 = new THREE.Mesh(
    new THREE.BoxGeometry(28, 40, 28, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 241) return;

    var valid0 =
      objects[0].position.x < 12.25 &&
      objects[0].position.x > -12.25 &&
      objects[0].position.y < 18.25 &&
      objects[0].position.y > -18.25 &&
      objects[0].position.z < 12.25 &&
      objects[0].position.z > -12.25;
    //   ,
    // valid1 =
    //   objects[1].position.x < 12.25 &&
    //   objects[1].position.x > -12.25 &&
    //   objects[1].position.y < 18.25 &&
    //   objects[1].position.y > -18.25 &&
    //   objects[1].position.z < 12.25 &&
    //   objects[1].position.z > -12.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_rectprism1(onComplete) {
  mode = 241;
  three_init_test_rectprism1(onComplete);
  three_render_test_rectprism1();
}

function three_init_test_rectprism2(onComplete) {
  three_init_test(242);

  object0 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 28, 28, 12, 12, 12),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 242) return;

    var valid0 =
      objects[0].position.x < 18.25 &&
      objects[0].position.x > -18.25 &&
      objects[0].position.y < 12.25 &&
      objects[0].position.y > -12.25 &&
      objects[0].position.z < 12.25 &&
      objects[0].position.z > -12.25;
    //   ,
    // valid1 =
    //   objects[1].position.x < 18.25 &&
    //   objects[1].position.x > -18.25 &&
    //   objects[1].position.y < 12.25 &&
    //   objects[1].position.y > -12.25 &&
    //   objects[1].position.z < 12.25 &&
    //   objects[1].position.z > -12.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_rectprism2(onComplete) {
  mode = 242;
  three_init_test_rectprism2(onComplete);
  three_render_test_rectprism2();
}

function three_init_test_cylinder1(onComplete) {
  three_init_test(251);

  object0 = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 251) return;

    var valid0 =
      objects[0].position.y < 18.25 && objects[0].position.y > -18.25;
    //   ,
    // valid1 = objects[1].position.y < 18.25 && objects[1].position.y > -18.25;

    var d0 = Math.sqrt(
      objects[0].position.x * objects[0].position.x +
        objects[0].position.z * objects[0].position.z
    );
    // ,
    // d1 = Math.sqrt(
    //   objects[1].position.x * objects[1].position.x +
    //     objects[1].position.z * objects[1].position.z
    // );

    valid0 = valid0 && d0 < 14.25;
    // valid1 = valid1 && d1 < 14.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_cylinder1(onComplete) {
  mode = 251;
  three_init_test_cylinder1(onComplete);
  three_render_test_cylinder1();
}

function three_init_test_cylinder2(onComplete) {
  three_init_test(252);

  object0 = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  object0.rotateZ(-Math.PI * 0.5);
  object0.position.set(0, 0, 0);
  scene.add(object0);

  $("#btn3dCheck").click(function() {
    if (mode != 252) return;

    var valid0 =
      objects[0].position.x < 18.25 && objects[0].position.x > -18.25;
    //   ,
    // valid1 = objects[1].position.x < 18.25 && objects[1].position.x > -18.25;

    var d0 = Math.sqrt(
      objects[0].position.y * objects[0].position.y +
        objects[0].position.z * objects[0].position.z
    );
    // ,
    // d1 = Math.sqrt(
    //   objects[1].position.y * objects[1].position.y +
    //     objects[1].position.z * objects[1].position.z
    // );

    valid0 = valid0 && d0 < 14.25;
    // valid1 = valid1 && d1 < 14.25;

    // var msg =
    //   valid0 && valid1
    //     ? "Both dots are inside the shape."
    //     : !valid0 && !valid1
    //     ? "Both dots are outside the shape."
    //     : !valid0
    //     ? "The green dot is outside the shape."
    //     : "The yellow dot is outside the shape.";
    var msg = valid0 ? "Dot is inside the shape" : "Dot is outside the shape";
    $("#testResult").html(msg);

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
  renderer.render(scene, camera);
  // controls.update(clock.getDelta());
}

function three_play_test_cylinder2(onComplete) {
  mode = 252;
  three_init_test_cylinder2(onComplete);
  three_render_test_cylinder2();
}
