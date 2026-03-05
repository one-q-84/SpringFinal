import * as THREE from 'three'

export function addLight() {
    const lightGroup = new THREE.Group();

    // TO ADD FOR FULLER VISUAL
    // const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    // lightGroup.add(ambient);

    // Creates Wall Effect
    const point = new THREE.PointLight(0xffffff, 100);
    point.position.set(0, 0, 0); 
    lightGroup.add(point);

    return lightGroup;
}
