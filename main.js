import './style.css'
import * as THREE from 'three';
//Controls
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
//background
function moveCAmera(){
  const t = document.body.getBoundingClientRect().top;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  camera.position.x = t * -0.01
  camera.position.y = t * -0.0002
  camera.position.z = t * -0.0002
}

document.body.onscroll = moveCAmera
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  earth.rotation.x += 0.001
  earth.rotation.y += 0.005
  
  controls.update();

  
  renderer.render( scene, camera );

  
}
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);
  //random generates across screen
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) )

  star.position.set(x, y, z);
  scene.add(star)
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

const geometry =  new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshStandardMaterial( {
  color: 0xFF6347
});
//light
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)
scene.add(pointLight)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

Array(200).fill().forEach(addStar)
//stars


//bg


//torus
const controls = new OrbitControls(camera, renderer.domElement);
const torus = new THREE.Mesh( geometry, material);

//earth

const earthTextture = new THREE.TextureLoader().load('earth.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTextture,
  })
  
);

earth.position.z = 10
earth.position.x = 20;

scene.add(earth)
scene.add(torus)
scene.add(camera)
earth.addEventListener( 'click', function () {

  // Update the camera's position to focus on the mesh
  camera.lookAt( earth.position );

} );

const spaceTexture = new THREE.TextureLoader().load('bg.jpg');
scene.background = spaceTexture;

document.getElementById('color-button').addEventListener('click', function() {


  if (document.getElementById('color-palette').style.display === 'none') {
    // show the button
    document.getElementById('color-palette').style.display = 'flex';
  } else {
    // hide the button
    document.getElementById('color-palette').style.display = 'none';
  }
});
document.querySelectorAll('.color').forEach(function(color) {
  color.addEventListener('click', function() {
    document.getElementById('style').style.color = this.style.backgroundColor;
  });
});
animate()

 