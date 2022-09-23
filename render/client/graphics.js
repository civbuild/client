
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
keys = {},
start = Date.now(),
sphere_rotation_speed_x = 0,
sphere_rotation_speed_y = 0,
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
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 25, 100, 25 );

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    container = document.getElementById( "container" );
    container.appendChild( renderer.domElement );

    // conrols
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;

    // event listeners
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize );

    document.body.addEventListener( 'keydown', function(e) {
    
        var key = e.code.replace('Key', '').toLowerCase();
        keys[ key ] = true;
        
    });

    document.body.addEventListener( 'keyup', function(e) {
    
        var key = e.code.replace('Key', '').toLowerCase();
        keys[ key ] = false;
        
    });

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

    // animate explosion
    explosion_material.uniforms[ 'time' ].value = 0.00025 * ( Date.now() - start );   

    // sphere rotation control
    if ( keys.w )
        sphere_rotation_speed_y += 0.01;
    else if ( keys.s )
        sphere_rotation_speed_y -= 0.01;

    if ( keys.a )
        sphere_rotation_speed_x += 0.01;
    else if ( keys.d )
        sphere_rotation_speed_x -= 0.01;

    console.log(sphere_rotation_speed_x);

    // sphere rotation animation
    explosion_mesh.rotation.x += sphere_rotation_speed_x;
    explosion_mesh.rotation.y += sphere_rotation_speed_y;

    // look at explosion
    camera.lookAt(explosion_mesh.position);

    // render and render the next frame
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}