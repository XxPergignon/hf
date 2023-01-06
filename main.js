import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//Controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const loader = new GLTFLoader();

loader.load( 'house.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
});
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = Math.PI / 4; // limit to 45 degrees above horizontal
controls.maxPolarAngle = Math.PI / 2.1; // limit to 90 degrees above horizontal
controls.minDistance = 10; // minimum zoom distance
controls.maxDistance = 100; // maximum zoom distance
controls.enablePan = true;
//Scroll animation with object position






//STARS


//END
//OBJECT ANIMATION


//END
//LIGHT
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 1);
scene.add(pointLight);

//GRIDD
const gridHelper = new THREE.GridHelper(200, 50);


//FLOOR
const floorTexture = new THREE.TextureLoader().load('floor.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(500, 500)
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const planeWidth = renderer.domElement.offsetWidth;
const planeHeight = renderer.domElement.offsetHeight;
const planegeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
planegeometry.parameters.widthSegments = 200;
planegeometry.parameters.heightSegments = 200;
const plane = new THREE.Mesh(planegeometry, floorMaterial);
plane.rotation.x = -Math.PI / 2;
//OBJETO2
const earthTextture = new THREE.TextureLoader().load("earth.jpg");
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTextture,
  })
);

const bladeCount = 1000;
const bladePositions = [];
for (let i = 0; i < bladeCount; i++) {
  bladePositions.push((Math.random() - 0.5) * 20); // x position
  bladePositions.push(0); // y position
  bladePositions.push((Math.random() - 0.5) * 20); // z position
}
const bladeGeometry = new THREE.BufferGeometry();
bladeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bladePositions, 3));

const bladeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 }
  },
  vertexShader: `
    uniform float time;
    void main() {
      vec3 v = position;
      v.y = sin(v.x * 5.0 + time) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(v, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
  `
});

const bladeSystem = new THREE.Points(bladeGeometry, bladeMaterial);

scene.add(bladeSystem);






camera.position.y = 10;
earth.position.z = 50;
earth.position.x = 50;
earth.position.y = 20;
//OBJECTS IN SCENE
scene.add(earth);

scene.add(plane);
scene.add(camera);



//BACKGROUND#/
/*
const spaceTexture = new THREE.TextureLoader().load("bg.jpg");
scene.background = spaceTexture;
*/
//BUTTON TO CHANGE COLOR OF TEXT
document.getElementById("color-button").addEventListener("click", function () {
  if (document.getElementById("color-palette").style.display === "none") {
    // show the button
    document.getElementById("color-palette").style.display = "flex";
  } else {
    // hide the button
    document.getElementById("color-palette").style.display = "none";
  }
});
document.querySelectorAll(".color").forEach(function (color) {
  color.addEventListener("click", function () {
    document.getElementById("style").style.color = this.style.backgroundColor;
  });
});
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  //random generates across screen
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

function animate() {
  
  requestAnimationFrame(animate);
  earth.rotation.x += 0.001;
  earth.rotation.y += 0.005;
  controls.update();
  bladeMaterial.uniforms.time.value += 0.01;
  renderer.render(scene, camera);
}

animate();
//END
//ANIMATE OBJECTS

