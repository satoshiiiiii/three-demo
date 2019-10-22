import Entry from "entry";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Texture } from "three";
// import * as controls from 'three-orbit-controls';

let scene,
    box,
    box_white,

    sphere,
    sphere1,
    sphere2,
    sphere3,
    plane,

    person,
    head,
    body,
    light,
    ambient,
    renderer,
    camera,
    loader;

let gridHelper,
    axisHelper,
    lightHelper,
    shadowHelper;

const width = 600,
      height = 600;

let theta = 0;

//orbit controls
let controls;
// scene ステージ
scene =  new THREE.Scene();

// // ******************************************************************
// mesh 物体
// - geometry 形状
// - materiarl 材質
// // ******************************************************************

box  = new THREE.Mesh(
  new THREE.BoxGeometry(50,50,50), // 形状 幅,高さ,奥行き
  new THREE.MeshLambertMaterial({ //　材質
    // color:0xff0000  //16進数
    // color:"#00ff00"
    // color:"rgb(22,50,200)" //rgbaも使えるが aは無視される
    // color:"hsl(100,50%,20%)"
    color: new THREE.Color(0xff0000)  //three.js オブジェクトも用意されている
  })
);

// ----------------------------------------
// 操作
// - position
// - scale
// - rotation
// ----------------------------------------

// 位置
box.position.set(0,50,0); //x,y,z
// box.position.x = 100;  //x,y,zバラバラでの指定方法
// box.position.y = 50;
// box.position.z = 0;

// 拡大
// box.scale.set(2,1,0.5); //x,y,z
box.scale.z = 2;

// 回転
// box.rotation.x = 45*Math.PI / 180;
box.rotation.set(80 * Math.PI / 180,0,0);
// scene.add(box);


head = new THREE.Mesh(
  new THREE.BoxGeometry(20,20,20),
  new THREE.MeshLambertMaterial({color:0xff0000})
)
head.position.set(0,40,0);
scene.add(head);

body = new THREE.Mesh(
  new THREE.BoxGeometry(40, 60, 40),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
)
body.position.set(0, 0, 0);
// scene.add(body);

// group
person = new THREE.Group();
person.add(head);
person.add(body);
// scene.add(person);


// sphere
sphere = new THREE.Mesh(
  new THREE.SphereGeometry(30,20,20),
  new THREE.MeshLambertMaterial({ color: 0x4caf50 })
)
sphere.position.set(100, 40, 0);
// scene.add(sphere);

// plane
plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200,200),
  new THREE.MeshLambertMaterial({ color: 0x009876 ,side:THREE.DoubleSide})  //デフォでは片面のみ描画
)
plane.position.set(0, -50, 10);
plane.rotation.x = 90;
// scene.add(plane);

// spheres
sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(50, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0x4caf50 })
)
sphere1.position.set(100, 0, -150);
// scene.add(sphere1);

sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(50, 20, 20),
  new THREE.MeshLambertMaterial({ color: 0x4caf50 })
)
sphere2.position.set(100, 0, 0);
// scene.add(sphere2);

sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(50, 20, 20),
  // new THREE.MeshPhongMaterial({ color: 0x4caf50 })
  new THREE.MeshPhongMaterial({ color: 0x4caf50 ,wireframe:true})
)
sphere3.position.set(100, 0, 150);
// scene.add(sphere3);
// ******************************************************************
// light
// ******************************************************************

light = new THREE.DirectionalLight(0xffffff,1); // 並行光源 白 ,強さ
light.position.set(0,100,30);
scene.add(light);

ambient = new THREE.AmbientLight(0x404040); // 環境光 自然な仕上がりになる
scene.add(ambient);

// ******************************************************************
// camera
// ******************************************************************
camera = new THREE.PerspectiveCamera(45, width / height,1,2000 ); //画角
camera.position.set(1000,200,1000);
camera.lookAt(scene.position);

// ******************************************************************
// helper
// ******************************************************************
gridHelper = new THREE.GridHelper(200,50) //全体サイズ,1つのグリッドサイズ
scene.add(gridHelper);

axisHelper = new THREE.AxisHelper(1000) //軸のサイズ
scene.add(axisHelper);

lightHelper = new THREE.DirectionalLightHelper(light,20) //
// scene.add(lightHelper);

// controls
// controls = new THREE.OrbitControls(camera);  //エラー出る
// controls = new OrbitControls(camera);
// controls.autoRotate = true;

// const orbitControls = controls(THREE);
// new orbitControls(camera);




//texture
loader = new THREE.TextureLoader();
loader.load("/images/img.jpg",function(texture){
  createBox(texture);
  render();
})

function createBox(texture){
  box_white = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, 50),
    new THREE.MeshLambertMaterial({ map:texture })
  );
  box_white.position.set(0, 0, 0);
  scene.add(box_white);
}






// ******************************************************************
// renderer
// ******************************************************************
renderer = new THREE.WebGLRenderer({ antialias: true }) // オプションでantialias なめらか
renderer.setSize(width,height);
renderer.setClearColor(0xefefef);
renderer.setPixelRatio(window.devicePixelRatio);  // 解像度の高いディスプレイできれいに表示される
document.getElementById("stage").appendChild(renderer.domElement);




// ******************************************************************
// shadow
// ******************************************************************
renderer.shadowMap.enabled = true;
light.castShadow = true;
light.shadow.camera.left = -200;
light.shadow.camera.right = 200;
light.shadow.camera.top = 200;
light.shadow.camera.bottom = -200;
shadowHelper = new THREE.CameraHelper(light.shadow.camera);

// scene.add(shadowHelper);

// box.castShadow = true;
// plane.receiveShadow = true;


//ただのレンダリング
// renderer.render(scene,camera);

// 再起手に呼び出してアニメーションさせる
function render(){
  requestAnimationFrame(render);

  // カメラの回転
  theta += 0.1;
  camera.position.x = Math.cos(THREE.Math.degToRad(theta)) * 300; //度からradianに変換 半径300
  camera.position.z = Math.sin(THREE.Math.degToRad(theta)) * 300;
  camera.lookAt(scene.position); //向きは中央へ

  //boxの回転
  // box.rotation.y += 0.05;

  //personの回転
  person.rotation.y += 0.03;

  // controls.update();
  renderer.render(scene,camera);
}
// render();

if (module.hot) {
  module.hot.accept();
}
