
import * as THREE from 'three'
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

var
container,
renderer,
scene,
camera,
mesh,
textureLoader = new THREE.TextureLoader(),
material,
start = Date.now(),
fov = 30;

window.addEventListener( 'load', function() {

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
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

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

} );

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