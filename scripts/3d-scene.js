class Scene3D {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.shapes = [];
        this.isDarkMode = document.body.classList.contains('dark-mode');
        this.init();
    }

    init() {
        // Setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 15;  // Move camera back to accommodate larger cube

        // Simple lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Create single shape
        this.createShape();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('change', (e) => {
            this.isDarkMode = e.target.checked;
            this.updateCubeColor();
        });
        
        // Initial color set
        this.updateCubeColor();
        this.animate();
    }

    createShape() {
        // Create larger base geometry
        const geometry = new THREE.BoxGeometry(8, 8, 8);  // Much larger cube
        
        // Create edges geometry (will only show outer edges)
        const edges = new THREE.EdgesGeometry(geometry);
        
        // Store material reference
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: this.isDarkMode ? 0xffffff : 0x000000,
            linewidth: 2,  // Thicker lines
            transparent: true,
            opacity: 0.8
        });

        // Create line segments instead of mesh
        const cube = new THREE.LineSegments(edges, this.lineMaterial);
        cube.position.set(0, 0, 0);
        
        // Slightly slower rotation for larger cube
        cube.userData.rotationSpeed = {
            x: 0.003,
            y: 0.005
        };

        this.shapes = [cube];
        this.scene.add(cube);
    }

    updateCubeColor() {
        if (this.lineMaterial) {
            const newColor = this.isDarkMode ? 0xffffff : 0x000000;
            this.lineMaterial.color.setHex(newColor);
            this.lineMaterial.needsUpdate = true;
        }
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate each shape
        this.shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Scene3D();
});
