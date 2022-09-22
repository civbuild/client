
import * as THREE from 'three'
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

var
container,
renderer,
scene,
camera,
mesh,
vertexShader,
fragmentShader,
textureLoader = new THREE.TextureLoader(),
material,
start = Date.now(),
fov = 30;

async function load_shaders() {
    vertexShader = await fetch('vertex_shader.glsl').then(result => result.text());
    fragmentShader = await fetch('fragment_shader.glsl').then(result => result.text());
}

function init() {

    container = document.getElementById( "container" );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000 );
    camera.position.z = 100;


    material = new THREE.ShaderMaterial( {

        uniforms: {
            tExplosion: {
            type: "t",
            value: textureLoader.load( 'explosion.png' )
            },
            time: {
            type: "f",
            value: 0.0
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader

    } );

    mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry( 50, 4 ),
        material
    );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    var controls = new OrbitControls( camera, renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize );

    render();
}

window.addEventListener( 'load', function() {
    load_shaders().then(init);
});

function onWindowResize () {

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

function render() {

    material.uniforms[ 'time' ].value = 0; //.00025 * ( Date.now() - start );

    renderer.render( scene, camera );
    requestAnimationFrame( render );

}