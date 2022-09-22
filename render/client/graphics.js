
import * as THREE from 'three'
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

var
container,
renderer,
scene,
camera,
mesh,
vertexShader,
fragmentShader,
textureLoader = new THREE.TextureLoader(),
modelLoader = new GLTFLoader(),
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

    modelLoader.load( './models/small_house/scene.gltf', function ( gltf ) {
        scene.add(gltf.scene);
    }, undefined, function ( error ) {
        console.error( error );
    } );

    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000 );
    camera.position.z = 500;

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

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
        new THREE.IcosahedronGeometry( 50, 20 ),
        material
    );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    var controls = new OrbitControls( camera, renderer.domElement );
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: ''
    }

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