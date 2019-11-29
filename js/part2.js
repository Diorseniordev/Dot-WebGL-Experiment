var scene1, scene2, camera1, camera2, renderer1, renderer2, plane12, plane22;

function three_init_part2(onComplete) {
  // container = document.createElement("div");
  container = $("#part2_container");
  container.width("90%");
  container.height("50%");
  width = container.width();
  height = container.height();
  controls.enabled = false;
  scene1 = new THREE.Scene();
  scene2 = new THREE.Scene();
  camera1 = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera2 = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  scene1.add(camera1);
  scene2.add(camera2);
  selectedView = Math.floor(Math.random() * 18);
  let pos = views[selectedView];

  // console.log(selectedView);
  camera1.position.set(pos.x, pos.y, pos.z);
  camera2.position.set(pos.x, pos.y, pos.z);
  camera1.lookAt(new THREE.Vector3(0, 0, 0));
  camera2.lookAt(new THREE.Vector3(0, 0, 0));
  renderer1 = new THREE.WebGLRenderer({ antialias: true });
  renderer1.setSize(400, 400);
  renderer2 = new THREE.WebGLRenderer({ antialias: true });
  renderer2.setSize(400, 400);

  scene1.add(new THREE.AmbientLight(0x444444));
  scene2.add(new THREE.AmbientLight(0x444444));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 100).normalize();
  var dirLight2 = new THREE.DirectionalLight(0xffffff);
  dirLight2.position.set(100, 100, 100).normalize();

  camera1.add(dirLight);
  camera1.add(dirLight.target);
  camera2.add(dirLight2);
  camera2.add(dirLight2.target);
  clock = new THREE.Clock();

  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(500, 500, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  plane.visible = false;
  plane12 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(500, 500, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  plane12.visible = false;

  scene1.add(plane);
  scene2.add(plane12);
  var cbgeometry = new THREE.PlaneGeometry(50, 50, 8, 8),
    cbmaterials = [];
  cbmaterials.push(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    })
  );
  cbmaterials.push(
    new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    })
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
  scene1.add(plane2);
  var plane22 = new THREE.Mesh(
    cbgeometry,
    new THREE.MeshFaceMaterial(cbmaterials)
  );
  plane22.rotation.x = Math.PI / 2;
  plane22.position.y = -22;
  scene2.add(plane22);

  container.append(renderer1.domElement);

  container.append(renderer2.domElement);
  $("canvas:eq( 2 )").css("float", "left");
  $("canvas:eq( 3 )").css("float", "right");
  material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
  material.transparent = true;
  material.opacity = 0.5;
  material.wireframe = false;

  //   objects = [];

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
  object2.position.set(0, 0, 0);
  var object22 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material2);
  object22.position.set(0, 0, 0);
  //   objects.push(object2);
  scene1.add(object2);
  scene2.add(object22);
  // var material3 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  // var object3 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material3);
  // object3.position.set(p2.x, p2.y, p2.z);
  // objects.push(object3);
  // scene.add(object3);

  //   offset = new THREE.Vector3();
  //   raycaster = new THREE.Raycaster();

  //   container.fadeIn();
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  // $("#btn3dWireframe").click(function () {
  //   if (mode != modeFlag) return;
  //   object0.material.wireframe = !object0.material.wireframe;
  // });
}
