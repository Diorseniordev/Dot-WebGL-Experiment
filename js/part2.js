var scene1,
  scene2,
  camera1,
  camera2,
  renderer1,
  renderer2,
  plane12,
  plane22,
  plane2,
  plane22,
  object2,
  object22,
  material2,
  part2Volume1,
  part2Volume2,
  part2Views = [];
var part2Volume,
  part2VolumeArr1 = [],
  part2VolumeArr2 = [],
  sceneOrder = [1, 2],
  saveDataArr = [],
  dataCount = 0,
  block2start = 0;

function fillVolumeArr1() {
  part2VolumeArr1[0] = new THREE.Mesh(
    new THREE.BoxGeometry(32, 32, 32, 12, 12, 12),
    material
  );

  part2VolumeArr1[1] = new THREE.Mesh(
    new THREE.SphereGeometry(20, 24, 24),
    material
  );

  part2VolumeArr1[2] = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 25, 40, 4, 16),
    material
  );

  part2VolumeArr1[3] = new THREE.Mesh(
    new THREE.BoxGeometry(28, 40, 28, 12, 12, 12),
    material
  );

  part2VolumeArr1[4] = new THREE.Mesh(
    new THREE.BoxGeometry(40, 28, 28, 12, 12, 12),
    material
  );

  part2VolumeArr1[5] = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );

  part2VolumeArr1[6] = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  part2VolumeArr1[6].rotateZ(-Math.PI * 0.5);
}
function fillVolumeArr2() {
  part2VolumeArr2[0] = new THREE.Mesh(
    new THREE.BoxGeometry(32, 32, 32, 12, 12, 12),
    material
  );

  part2VolumeArr2[1] = new THREE.Mesh(
    new THREE.SphereGeometry(20, 24, 24),
    material
  );

  part2VolumeArr2[2] = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 25, 40, 4, 16),
    material
  );

  part2VolumeArr2[3] = new THREE.Mesh(
    new THREE.BoxGeometry(28, 40, 28, 12, 12, 12),
    material
  );

  part2VolumeArr2[4] = new THREE.Mesh(
    new THREE.BoxGeometry(40, 28, 28, 12, 12, 12),
    material
  );

  part2VolumeArr2[5] = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );

  part2VolumeArr2[6] = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 16, 40, 20, 16),
    material
  );
  part2VolumeArr2[6].rotateZ(-Math.PI * 0.5);
}

function addVolumeToScene(name) {
  scene1.remove(part2Volume1);
  scene2.remove(part2Volume2);
  switch (name) {
    case "cube":
      console.log("cube");

      part2Volume1 = part2VolumeArr1[0];
      part2Volume2 = part2VolumeArr2[0];
      break;
    case "sphere":
      console.log("sphere");
      part2Volume1 = part2VolumeArr1[1];
      part2Volume2 = part2VolumeArr2[1];
      break;
    
    case "rectangle prism standing":
      console.log("rectangle prism standing");
      part2Volume1 = part2VolumeArr1[3];
      part2Volume2 = part2VolumeArr2[3];
      break;
    case "rectangle prism":
      console.log("rectangle prism");
      part2Volume1 = part2VolumeArr1[4];
      part2Volume2 = part2VolumeArr2[4];
      break;
    case "cylinder standing":
      console.log("cylinder standing");
      part2Volume1 = part2VolumeArr1[5];
      part2Volume2 = part2VolumeArr2[5];
      break;
    case "cylinder":
      console.log("cylinder");
      part2Volume1 = part2VolumeArr1[6];
      part2Volume2 = part2VolumeArr2[6];
      break;
  }
  scene1.add(part2Volume1);
  scene2.add(part2Volume2);
}

function three_init_part2(onComplete) {
  // container = document.createElement("div");
  container = $("#part2_container");
  container.width("90%");
  container.height("400px");
  width = container.width();
  height = container.height();
  controls.enabled = false;
  scene1 = new THREE.Scene();
  scene2 = new THREE.Scene();
  camera1 = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera2 = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  scene1.add(camera1);
  scene2.add(camera2);
  part2Views = shuffle(views);

  let pos = part2Views[0];
  part2Volume = testArr[--testCount];

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

  plane2 = new THREE.Mesh(cbgeometry, new THREE.MeshFaceMaterial(cbmaterials));
  plane2.rotation.x = Math.PI / 2;
  plane2.position.y = -22;
  scene1.add(plane2);

  // addVolumeToScene("cube", scene2);
  plane22 = new THREE.Mesh(cbgeometry, new THREE.MeshFaceMaterial(cbmaterials));
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

  material2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  object2 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material2);

  object22 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material2);

  // object2.position.set(0, 0, 0);
  //
  //   objects.push(object2);
  scene1.add(object2);
  scene2.add(object22);

  fillVolumeArr1();
  fillVolumeArr2();

  // var material3 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
  // var object3 = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), material3);
  // object3.position.set(p2.x, p2.y, p2.z);
  // objects.push(object3);
  // scene.add(object3);

  //   offset = new THREE.Vector3();
  //   raycaster = new THREE.Raycaster();

  //   container.fadeIn();
  // renderer1.render(scene1, camera1);
  // renderer2.render(scene2, camera2);
  // addVolumeToScene(part2Volume);

  placeDot();

  // object22.position.set(0, 0, 0);
  $(".leftPrefer").click(function() {
    if ((Date.now() - block2start) < 10)
      console.log("ignored");
    else if ((Date.now() - block2start) < 100)
      { 
        if(alertCount == 0) {
          alertMX("You responded too fast");
          alertCount = 1;
        }
      }
    else saveExpData(1);
  });
  $(".rightPrefer").click(function() {
    if ((Date.now() - block2start) < 10)
      console.log("ignored")
    else if ((Date.now() - block2start) < 100)
    { 
      if(alertCount == 0) {
        alertMX("You responded too fast");
        alertCount = 1;
      }
    }
    else saveExpData(2);
  });

  // $("#btn3dWireframe").click(function () {
  //   if (mode != modeFlag) return;
  //   object0.material.wireframe = !object0.material.wireframe;
  // });
}
function placeDot() {
  if (dataCount < 12) {
    addVolumeToScene(testArr[Math.floor(dataCount / 4)]);
    sceneOrder = shuffle(sceneOrder);
    block2start = Date.now();
    let pos = testResults[Math.floor(dataCount / 4)].endPosition;

    if (sceneOrder[0] == 1) {
      object2.position.set(pos.x, pos.y, pos.z);

      var randPos = getRandomPoint(pos, testArr[Math.floor(dataCount / 4)]);
      object22.position.set(randPos.x, randPos.y, randPos.z);
    } else {
      var randPos = getRandomPoint(pos, testArr[Math.floor(dataCount / 4)]);
      object2.position.set(randPos.x, randPos.y, randPos.z);
      // object2.position.set(pos.x, pos.y, pos.z);
      object22.position.set(pos.x, pos.y, pos.z);
    }
  } else {
    if (dataCount == 12)
      alertMX("You are all set to start choose the real data now!");
    addVolumeToScene(part2Volume);
    block2start = Date.now();
    sceneOrder = shuffle(sceneOrder);
    let pos = testResults[testResults.length - 1].endPosition;
    if (sceneOrder[0] == 1) {
      object2.position.set(pos.x, pos.y, pos.z);

      var randPos = getRandomPoint(pos, testArr[testResults.length - 1]);
      object22.position.set(randPos.x, randPos.y, randPos.z);
    } else {
      var randPos = getRandomPoint(pos, testArr[testResults.length - 1]);
      object2.position.set(randPos.x, randPos.y, randPos.z);
      // object2.position.set(pos.x, pos.y, pos.z);
      object22.position.set(pos.x, pos.y, pos.z);
    }
  }

  plane2.visible = false;
  plane22.visible = false;
  object2.visible = false;
  object22.visible = false;
  part2Volume1.visible = false;
  part2Volume2.visible = false;

  setTimeout(() => {
    plane2.visible = true;
    plane22.visible = true;
    object2.visible = true;
    object22.visible = true;
    part2Volume1.visible = true;
    part2Volume2.visible = true;
    renderer1.render(scene1, camera1);
    renderer2.render(scene2, camera2);
  }, 500);
}
function findViewIndex(view) {  
  for (let index = 0; index < views.length; index++) {
    if (view.distanceTo(views[index]) < 0.5) return index;
  }
  return "no index";
}
var saveCount = 0;
function saveExpData(origin) {
  if (dataCount < part2Views.length + 12) {
    if (dataCount >= 12) {
      saveDataArr.push({ selected: origin });
      saveDataArr[saveCount].type = part2Volume;
      saveDataArr[saveCount].view = part2Views[saveCount];
      saveDataArr[saveCount].part1ViewedTime =
        camera.userData.viewedTime[findViewIndex(part2Views[saveCount])];
      saveDataArr[saveCount].viewedCount =
        camera.userData.viewedCount[findViewIndex(part2Views[saveCount])];
      saveDataArr[saveCount].originalPos =
        testResults[testResults.length - 1].endPosition;
      saveDataArr[saveCount].shiftedPos = newPoint;
      saveDataArr[saveCount].dotStatus = sceneOrder[0] == 1 ? "L" : "R";
      saveDataArr[saveCount].selected = sceneOrder[0] == origin ? 1 : 0;
      saveDataArr[saveCount].time = ((Date.now() - block2start) / 1000).toFixed(
        3
      );

      camera1.position.set(
        part2Views[saveCount].x,
        part2Views[saveCount].y,
        part2Views[saveCount].z
      );
      camera2.position.set(
        part2Views[saveCount].x,
        part2Views[saveCount].y,
        part2Views[saveCount].z
      );
      camera1.lookAt(new THREE.Vector3(0, 0, 0));
      camera2.lookAt(new THREE.Vector3(0, 0, 0));

      saveCount++;
      dataCount++;

      var progress = Math.round((saveCount * 100) / 80);
      $("#testProgress2 > div > div").css("width", progress + "%");
      $("#testProgress2 span").html(progress);
      if (saveCount == part2Views.length) {
        $("#part2_wrapper").hide();
        $("#instructions1").hide();
        $(debriefing_questionairre_div_id).show();
        let post_data = new PostData(cgibin_dir + "dot_log_volume_block2.py");
        post_data.post(
          JSON.stringify({ turkID: worker_id, data_content: saveDataArr })
        );
      } else {
        placeDot();
        renderer1.render(scene1, camera1);
        renderer2.render(scene2, camera2);
      }
    } else {
      if (dataCount % 4 == 3) part2Views = shuffle(views);

      camera1.position.set(
        part2Views[dataCount % 4].x,
        part2Views[dataCount % 4].y,
        part2Views[dataCount % 4].z
      );
      camera2.position.set(
        part2Views[dataCount % 4].x,
        part2Views[dataCount % 4].y,
        part2Views[dataCount % 4].z
      );
      camera1.lookAt(new THREE.Vector3(0, 0, 0));
      camera2.lookAt(new THREE.Vector3(0, 0, 0));
      dataCount++;
      placeDot();
      renderer1.render(scene1, camera1);
      renderer2.render(scene2, camera2);
      var progress = Math.round(((dataCount % 4) * 100) / 4);
      $("#testProgress2 > div > div").css("width", progress + "%");
      $("#testProgress2 span").html(progress);
    }
  }
}
var newPoint;
function getRandomPoint(point, type) {
  var randviewtemp = new THREE.Vector3();
  if (dataCount < 12) randviewtemp = part2Views[dataCount % 4];
  else randviewtemp = part2Views[saveCount];
  var randview = new THREE.Vector3();
  randview.x = randviewtemp.x;
  randview.y = randviewtemp.y;
  randview.z = randviewtemp.z;
  randview = randview.normalize();
  randview.x = randview.x.toFixed(3) * 1;
  randview.y = randview.y.toFixed(3) * 1;
  randview.z = randview.z.toFixed(3) * 1;
  var constant =
    randview.x * point.x + randview.y * point.y + randview.z * point.z;

  newPoint = new THREE.Vector3();
  do {
    if (randview.z > 0.01 || randview.z < -0.01) {
      newPoint.x = point.x + Math.random() * 3 - 3
      newPoint.y = point.y + Math.random() * 3 - 3;
      newPoint.z =
        (constant - randview.x * newPoint.x - randview.y * newPoint.y) /
        randview.z;
    } else {
      newPoint.y = point.y + Math.random() * 3 - 3;
      newPoint.z = point.z + Math.random() * 3 - 3;
      newPoint.x =
        (constant - randview.y * newPoint.y - randview.z * newPoint.z) /
        randview.x;
    }

    countval++;

    if (countval == 5000) {
      console.log(
        constant,
        point,
        newPoint,
        randview,
        newPoint.distanceTo(point)
      );
      countval = 0;
      break;
    }
  } while (!(newPoint.distanceTo(point) > 2 && newPoint.distanceTo(point) < 3 && validatePoint(newPoint, type)));
  // while (!validatePoint(newPoint, type));
  newPoint.x = newPoint.x.toFixed(3) * 1;
  newPoint.y = newPoint.y.toFixed(3) * 1;
  newPoint.z = newPoint.z.toFixed(3) * 1;
  return newPoint;
}
var countval = 0;

function validatePoint(point, type) {
  var valid = false;
  let d0;
  switch (type) {
    case "cube":
      valid =
        point.x < 14 &&
        point.x > -14 &&
        point.y < 14 &&
        point.y > -14 &&
        point.z < 14 &&
        point.z > -14;
      break;
    case "sphere":
      valid = point.distanceTo(new THREE.Vector3(0, 0, 0)) < 18;
      break;
 
    case "rectangle prism standing":
      valid =
        point.x < 12 &&
        point.x > -12 &&
        point.y < 18 &&
        point.y > -18 &&
        point.z < 12 &&
        point.z > -12;
      break;
    case "rectangle prism":
      valid =
        point.x < 18 &&
        point.x > -18 &&
        point.y < 12 &&
        point.y > -12 &&
        point.z < 12 &&
        point.z > -12;
      break;
    case "cylinder standing":
      valid = point.y < 18 && point.y > -18;
      d0 = Math.sqrt(point.x * point.x + point.z * point.z);
      valid = valid && d0 < 14;
      break;
    case "cylinder":
      valid = point.x < 18 && point.x > -18;
      d0 = Math.sqrt(point.y * point.y + point.z * point.z);
      valid = valid && d0 < 14;
      break;
    default:
      break;
  }

  return valid;
}
// function getRandomPoint(point, type) {
//   var randviewtemp = new THREE.Vector3();
//   if (dataCount < 12) randviewtemp = part2Views[dataCount % 4];
//   else randviewtemp = part2Views[saveCount];
//   var randview = new THREE.Vector3();
//   randview.x = randviewtemp.x;
//   randview.y = randviewtemp.y;
//   randview.z = randviewtemp.z;
//   randview = randview.normalize();
//   randview.x = randview.x.toFixed(3) * 1;
//   randview.y = randview.y.toFixed(3) * 1;
//   randview.z = randview.z.toFixed(3) * 1;
//   var constant =
//     randview.x * point.x + randview.y * point.y + randview.z * point.z;

//   newPoint = new THREE.Vector3();
//   do {
//     if (randview.z > 0.01 || randview.z < -0.01) {
//       newPoint.x = point.x + Math.random() * 40 - 22
//       newPoint.y = point.y + Math.random() * 40 - 22;
//       newPoint.z =
//         (constant - randview.x * newPoint.x - randview.y * newPoint.y) /
//         randview.z;
//     } else {
//       newPoint.y = point.y + Math.random() * 40 - 22;
//       newPoint.z = point.z + Math.random() * 40 - 22;
//       newPoint.x =
//         (constant - randview.y * newPoint.y - randview.z * newPoint.z) /
//         randview.x;
//     }

//     countval++;

//     if (countval == 5000) {
//       console.log(
//         constant,
//         point,
//         newPoint,
//         randview,
//         newPoint.distanceTo(point)
//       );
//       countval = 0;
//       break;
//     }
//   } while (!(newPoint.distanceTo(point) > 20 && newPoint.distanceTo(point) < 25 && validatePoint(newPoint, type)));
//   // while (!validatePoint(newPoint, type));
//   newPoint.x = newPoint.x.toFixed(3) * 1;
//   newPoint.y = newPoint.y.toFixed(3) * 1;
//   newPoint.z = newPoint.z.toFixed(3) * 1;
//   return newPoint;
// }
// var countval = 0;

// function validatePoint(point, type) {
//   var valid = false;
//   let d0;
//   switch (type) {
//     case "cube":
//       valid =
//         point.x < 14 &&
//         point.x > -14 &&
//         point.y < 14 &&
//         point.y > -14 &&
//         point.z < 14 &&
//         point.z > -14;
//       break;
//     case "sphere":
//       valid = point.distanceTo(new THREE.Vector3(0, 0, 0)) < 18;
//       break;
 
//     case "rectangle prism standing":
//       valid =
//         point.x < 12 &&
//         point.x > -12 &&
//         point.y < 18 &&
//         point.y > -18 &&
//         point.z < 12 &&
//         point.z > -12;
//       break;
//     case "rectangle prism side":
//       valid =
//         point.x < 18 &&
//         point.x > -18 &&
//         point.y < 12 &&
//         point.y > -12 &&
//         point.z < 12 &&
//         point.z > -12;
//       break;
//     case "cylinder standing":
//       valid = point.y < 18 && point.y > -18;
//       d0 = Math.sqrt(point.x * point.x + point.z * point.z);
//       valid = valid && d0 < 14;
//       break;
//     case "cylinder side":
//       valid = point.x < 18 && point.x > -18;
//       d0 = Math.sqrt(point.y * point.y + point.z * point.z);
//       valid = valid && d0 < 14;
//       break;
//     default:
//       break;
//   }

//   return valid;
// }
