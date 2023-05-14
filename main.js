
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

// Model Loader
const loader = new PLYLoader();

// Model Information
const modelLink = 'http://raw.githubusercontent.com/jhhend/ply-model-simplifier/main/Dragon.ply';
dragon = null
dragon2 = null
simplifiedQuality = .875

// Load in the full quality model with no simplification
loader.load(
    modelLink,
    function(geometry) {
        simplifier = new THREE.SimplifyModifier()
        mat = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true })
        mesh = new THREE.Mesh(geometry, mat)

        dragon = mesh
        scene.add(mesh);
    },
    (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); },
    (error) => { console.log(error); }
)

loader.load(
    modelLink,
    function(geometry) {
        simplifier = new THREE.SimplifyModifier()
        mat = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true })
        mesh = new THREE.Mesh(geometry, mat)

        // Simplify the mesh
        simplified = mesh.clone();
        count = Math.floor(simplified.geometry.attributes.position.count * simplifiedQuality);
        simplified.geometry = simplifier.modify( simplified.geometry, count)

        dragon2 = simplified
        scene.add(simplified);
    },
    (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); },
    (error) => { console.log(error); }
)

camera.position.y = .095
camera.position.z = .25;

function animate() {
    requestAnimationFrame( animate );

    // Perform rotations on the dragons
    if (dragon != null) {
        dragon.rotation.y += 0.001
    }

    if (dragon2 != null) {
        if (dragon2.position[0] != .15) {
            dragon2.position.set(.15, 0, .15)
        }
        dragon2.rotation.y += 0.001
    }

    render()
};

function render() {
    renderer.render(scene, camera)
}

animate();
