import * as THREE from 'three'

export function addInstancedBalls(count = 2000) {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16); // Small balls
    const material = new THREE.MeshStandardMaterial({ 
        roughness: 0.1, 
        metalness: 1,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        // Positioning logic. Polar coordinates (angle + radius) to create tube effect.
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 4; // hole in the center 3 to 7 units out
        const z = Math.random() * 100 - 50;   // Spread them along the Z axis (-50 to 50)

        dummy.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            z
        );
        
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        //Give each ball a random color
        color.setHSL(Math.random(), 0.7, 0.5);
        mesh.setColorAt(i, color);
    }

    return mesh;
}