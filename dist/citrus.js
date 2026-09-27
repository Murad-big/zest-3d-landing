import * as THREE from './vendor/three.module.js';

// One alpha atlas supplies all three flavors. Both slices share geometry and maps.
const regions = [
  { x: 39, y: 24, width: 635, height: 641, rind: '#d5aa19' },
  { x: 742, y: 11, width: 678, height: 671, rind: '#eaa329' },
  { x: 1497, y: 23, width: 638, height: 644, rind: '#719d26' },
];

export async function createCitrus(renderer) {
  const atlas = await new THREE.TextureLoader().loadAsync('./assets/citrus-atlas.webp');
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const faceGeometry = new THREE.PlaneGeometry(1.02, 1.02);
  const baseUV = faceGeometry.attributes.uv.array.slice();
  const faces = new THREE.MeshPhysicalMaterial({ map: atlas, alphaTest: .25, roughness: .35, metalness: 0, clearcoat: .3, clearcoatRoughness: .25, emissiveMap: atlas, emissive: '#ffffff', emissiveIntensity: .12, envMapIntensity: .25 });

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = 64;
  const ctx = bumpCanvas.getContext('2d');
  const noise = ctx.createImageData(64, 64);
  for (let i = 0; i < 64 * 64; i++) {
    const value = 80 + ((i * 73 + (i % 31) * 47) % 140);
    noise.data.set([value, value, value, 255], i * 4);
  }
  ctx.putImageData(noise, 0, 0);
  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(5, 1);
  const rind = new THREE.MeshStandardMaterial({ color: regions[0].rind, roughness: .68, bumpMap: bump, bumpScale: .007 });
  const shellGeometry = new THREE.CylinderGeometry(.497, .497, .15, 64);
  const group = new THREE.Group();
  const slices = [1.1, .85].map(scale => {
    const slice = new THREE.Group();
    const shell = new THREE.Mesh(shellGeometry, rind);
    shell.rotation.x = Math.PI / 2;
    slice.add(shell);
    for (const direction of [1, -1]) {
      const face = new THREE.Mesh(faceGeometry, faces);
      face.position.z = direction * .077;
      if (direction < 0) face.rotation.y = Math.PI;
      slice.add(face);
    }
    slice.scale.setScalar(scale);
    group.add(slice);
    return slice;
  });

  function setFlavor(index) {
    const region = regions[index];
    rind.color.set(region.rind);
    const uv = faceGeometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (region.x + baseUV[i * 2] * region.width) / atlas.image.width,
        1 - (region.y + (1 - baseUV[i * 2 + 1]) * region.height) / atlas.image.height);
    }
    uv.needsUpdate = true;
  }

  function update(time, pointer, spin) {
    slices[0].position.set(-1.23 + pointer * .12, -1.1 + Math.sin(time * .7 + 1) * .08, .28);
    slices[0].rotation.set(.22 + Math.sin(time * .4) * .08, -.48 + pointer * .2, -.35 + Math.sin(time * .5) * .1 + spin * .3);
    slices[1].position.set(1.62 - pointer * .08, 1.48 + Math.sin(time * .6 + 3) * .1, -.4);
    slices[1].rotation.set(.1, .62 + Math.sin(time * .4) * .12, .38 - time * .055 - spin * .3);
  }
  setFlavor(0);
  update(0, 0, 0);
  return { group, setFlavor, update };
}
