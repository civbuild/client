
import * as THREE from 'three'
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

var
container,
renderer,
scene,
camera,
terrain_mesh,
explosion_mesh,
terrain_object,
explosion_object,
vertexShader,
fragmentShader,
textureLoader = new THREE.TextureLoader(),
modelLoader = new GLTFLoader(),
terrain_material,
explosion_material,
start = Date.now(),
fov = 30;

async function load_shaders() {
    vertexShader = await fetch('vertex_shader.glsl').then(result => result.text());
    fragmentShader = await fetch('fragment_shader.glsl').then(result => result.text());
}

function add_objects(scene) {

    // add a house
    modelLoader.load( './models/small_house/scene.gltf', function ( gltf ) {
        scene.add(gltf.scene);
    }, undefined, function ( error ) {
        console.error( error );
    } );

    // create material
    terrain_material = new THREE.ShaderMaterial( {

        uniforms: {
            tExplosion: {
                type: "t",
                value: textureLoader.load( 'terrain.png' )
            },
            time: {
                type: "f",
                value: 0.0
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader

    } );

    explosion_material = new THREE.ShaderMaterial( {

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

    // create object
    terrain_object = new THREE.IcosahedronGeometry( 50, 100 );

    explosion_object = new THREE.IcosahedronGeometry( 10, 20 );

    // create mesh
    terrain_mesh = new THREE.Mesh(
        terrain_object,
        terrain_material
    );
    scene.add( terrain_mesh );

    explosion_mesh = new THREE.Mesh(
        explosion_object,
        explosion_material
    );
    scene.add( explosion_mesh );

    // position mesh
    explosion_mesh.position.set(0,50,0);
}

function add_lighting(scene) {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

function init() {

    // scene
    scene = new THREE.Scene();
    add_objects(scene);
    add_lighting(scene);

    // camera
    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000 );
    camera.position.z = 500;

    // camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    // camera.position.set( 0, .2, 0 );

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    container = document.getElementById( "container" );
    container.appendChild( renderer.domElement );

    // conrols
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: ''
    }

    // window
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize );

    // start animations
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

    explosion_material.uniforms[ 'time' ].value = 0.00025 * ( Date.now() - start );   

    renderer.render( scene, camera );
    requestAnimationFrame( render );

}