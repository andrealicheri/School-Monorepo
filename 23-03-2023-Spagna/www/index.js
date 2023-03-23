var container, stats;
var camera, scene, controls, renderer;
var mesh;

var particleSystem, particleCount, particles;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x111111, 0.002 );

    ///////////////////
    // CONTROLS  //
    ///////////////////
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

    ///////////////////
    // OBJECTS  //
    ///////////////////
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    var crate = loader.load( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/212131/crate.gif' );
    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { map: crate } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    ///////////////////
    // SNOW  //
    ///////////////////
    particleCount = 15000;
    var pMaterial = new THREE.PointCloudMaterial({
      color: 0xFFFFFF,
      size: 2,
      map: loader.load(
         "https://s3-us-west-2.amazonaws.com/s.cdpn.io/212131/snow-small.png"
       ),
       blending: THREE.AdditiveBlending,
       depthTest: false,
       transparent: true
    });

    particles = new THREE.Geometry;
    for (var i = 0; i < particleCount; i++) {
        var pX = Math.random()*500 - 250,
            pY = Math.random()*500 - 250,
            pZ = Math.random()*500 - 250,
            particle = new THREE.Vector3(pX, pY, pZ);
        particle.velocity = {};
        particle.velocity.y = 0;
        particles.vertices.push(particle);
    }
    particleSystem = new THREE.PointCloud(particles, pMaterial);
    scene.add(particleSystem);

    ///////////////////
    // LIGHT  //
    ///////////////////
    var ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );

    ///////////////////
    // RENDERER  //
    ///////////////////
    renderer = new THREE.WebGLRenderer( { antialias: false });
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight / 5);;
    
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function simulateRain() {
    var pCount = particleCount;
    while (pCount--) {
    var particle = particles.vertices[pCount];
    if (particle.y < -200) {
      particle.y = 200;
      particle.velocity.y = 0;
    }
    particle.velocity.y -= Math.random() * .02;
    particle.y += particle.velocity.y;
    }
    particles.verticesNeedUpdate = true;
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

function animate() {
    requestAnimationFrame( animate );
    //mesh.rotation.x += 0.005;
    //mesh.rotation.y += 0.01;
    particleSystem.rotation.y += 0.01;
    simulateRain();
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}
