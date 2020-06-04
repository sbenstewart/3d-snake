var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var torus = new THREE.Mesh( geometry, material );
scene.add( torus );

camera.position.z = 50;

function animate() {
    requestAnimationFrame( animate );
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();

