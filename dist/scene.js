import * as THREE from './vendor/three.module.js';
import { flavors } from './data.js';

function labelTexture(flavor, renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = flavor.color; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#20251e';
  // Artwork is actual printed typography on a cylindrical UV map.
  ctx.save(); ctx.translate(1070, 590); ctx.rotate(-Math.PI / 2);
  ctx.font = '900 350px Golos, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('ZEST', 0, 0); ctx.restore();
  ctx.textAlign = 'center'; ctx.font = '900 72px Golos, Arial';
  flavor.label.split('\n').forEach((line, index) => ctx.fillText(line, 1024, 1170 + index * 76));
  ctx.font = '400 39px Golos, Arial'; ctx.fillText('330 ml', 1024, 1400);
  ctx.save(); ctx.translate(1390, 590); ctx.rotate(-Math.PI / 2);
  ctx.font = '400 24px Golos, Arial'; ctx.textAlign = 'center'; ctx.fillText('БОЛЬШЕ СОЛНЦА В КАЖДОЙ БАНКЕ.', 0, 0); ctx.restore();
  ctx.font = '900 50px Golos, Arial'; ctx.fillText('ZEST', 350, 390);
  ctx.font = '400 28px Golos, Arial';
  ['НАТУРАЛЬНЫЙ ЦИТРУС.', 'ЛЁГКИЕ ПУЗЫРЬКИ.', 'БОЛЬШОЕ ЛЕТО.', '', 'ПИТЬ ОХЛАЖДЁННЫМ'].forEach((text, i) => ctx.fillText(text, 350, 485 + i * 43));
  // Small back-of-pack printed stripes, away from the front product name.
  for (let i = 0; i < 37; i++) ctx.fillRect(218 + i * 7, 1060, i % 3 === 0 ? 4 : 2, 110);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createCan(textures) {
  const group = new THREE.Group();
  const aluminum = new THREE.MeshStandardMaterial({ color: '#d4d9d7', roughness: .23, metalness: .93 });
  const lidMetal = new THREE.MeshStandardMaterial({ color: '#b9c0bc', roughness: .32, metalness: .9 });
  const label = new THREE.MeshPhysicalMaterial({ map: textures[0], roughness: .4, metalness: .05, clearcoat: .3, clearcoatRoughness: .3 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.68, .68, 2.95, 96, 1, true), label);
  body.rotation.y = Math.PI;
  group.add(body);
  const shoulderMaterial = new THREE.MeshStandardMaterial({ color: flavors[0].color, roughness: .33, metalness: .35 });
  const shoulderPoints = [[.68,1.475],[.675,1.51],[.66,1.55],[.62,1.6],[.597,1.645],[.597,1.7]].map(([x,y]) => new THREE.Vector2(x,y));
  const shoulder = new THREE.Mesh(new THREE.LatheGeometry(shoulderPoints,96),shoulderMaterial);
  group.add(shoulder);
  const basePoints = [[.68,-1.475],[.675,-1.51],[.655,-1.56],[.612,-1.62],[.595,-1.65]].map(([x,y]) => new THREE.Vector2(x,y));
  group.add(new THREE.Mesh(new THREE.LatheGeometry(basePoints.reverse(),96),aluminum));
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.599,.599,.025,96),lidMetal);
  lid.position.y=1.697; group.add(lid);
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(.592,.592,.027,96),aluminum);
  bottom.position.y=-1.655; group.add(bottom);
  for(const [y,radius,tube] of [[1.717,.6,.025],[1.705,.552,.009],[-1.653,.594,.026],[-1.604,.622,.01]]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(radius,tube,10,96),aluminum);
    rim.rotation.x=Math.PI/2; rim.position.y=y; group.add(rim);
  }
  const groove = new THREE.Mesh(new THREE.TorusGeometry(.46,.008,8,64),aluminum);
  groove.rotation.x=Math.PI/2; groove.position.y=1.716; group.add(groove);
  const opening = new THREE.Mesh(new THREE.CircleGeometry(.18,40),new THREE.MeshStandardMaterial({color:'#616965',metalness:.7,roughness:.4}));
  opening.rotation.x=-Math.PI/2; opening.scale.set(.85,1.35,1); opening.position.set(0,1.714,-.22); group.add(opening);
  const tab = new THREE.Mesh(new THREE.TorusGeometry(.13,.046,8,48),aluminum);
  tab.rotation.x=Math.PI/2;tab.scale.set(.73,1.42,.25);tab.position.set(0,1.755,.05);group.add(tab);
  const rivet = new THREE.Mesh(new THREE.SphereGeometry(.044,12,8),aluminum);
  rivet.scale.y=.28;rivet.position.set(0,1.757,.17);group.add(rivet);
  // Deterministic condensation uses one instanced draw call.
  const dropGeometry = new THREE.SphereGeometry(1,8,6);
  const dropMaterial = new THREE.MeshPhysicalMaterial({color:'#ffffff',metalness:.05,roughness:.05,transparent:true,opacity:.48,clearcoat:1});
  const droplets = new THREE.InstancedMesh(dropGeometry,dropMaterial,105);
  const dummy = new THREE.Object3D();
  for(let i=0;i<105;i++) {
    const a=i*2.399963; const y=((i*47)%103)/103*2.7-1.35;
    const size=.009+(i%7)*.0028;
    dummy.position.set(Math.sin(a)*.681,y,Math.cos(a)*.681);
    dummy.scale.set(size,size*1.3,size*.7);dummy.lookAt(0,y,0);dummy.updateMatrix();
    droplets.setMatrixAt(i,dummy.matrix);
  }
  group.add(droplets);
  return { group, setFlavor(index) { label.map=textures[index]; shoulderMaterial.color.set(flavors[index].color); } };
}

function studioEnvironment(renderer) {
  const room = new THREE.Scene();room.background = new THREE.Color('#8a8d84');
  function panel(x,y,z,width,height,intensity) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity),side:THREE.DoubleSide}));
    mesh.position.set(x,y,z);mesh.lookAt(0,0,0);room.add(mesh);
  }
  panel(-3,2,4,2.8,7,5);panel(4,1,1,1,6,3);panel(0,6,0,5,5,4);panel(0,1,-5,5,5,.12);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(room,.02);pmrem.dispose();
  room.traverse(object => { object.geometry?.dispose();object.material?.dispose(); });
  return env;
}

export async function initScene(initial) {
  await document.fonts.ready;
  const stage = document.getElementById('product-stage');
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene = new THREE.Scene();
  const environment = studioEnvironment(renderer);scene.environment = environment.texture;scene.environmentIntensity=.35;
  const camera = new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,.25,7.1);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8c9d74,1.7));
  const keyLight = new THREE.DirectionalLight(0xffffff,2.3);keyLight.position.set(-3,5,6);scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff,.9);fillLight.position.set(4,1,-3);scene.add(fillLight);
  const textures = flavors.map(flavor => labelTexture(flavor,renderer));
  const can = createCan(textures);scene.add(can.group);
  // Render collection stills once from the same real model: no extra WebGL contexts.
  renderer.setSize(600,720,false);renderer.setPixelRatio(1);
  camera.aspect=600/720;camera.position.z=6.4;camera.updateProjectionMatrix();
  can.group.rotation.set(.22,-.12,-.15);
  flavors.forEach((flavor,index) => {
    can.setFlavor(index);renderer.render(scene,camera);
    const image = document.querySelector(`[data-product-image="${index}"]`);
    image.src=renderer.domElement.toDataURL('image/png');image.classList.remove('fallback-pink','fallback-green');
  });
  can.setFlavor(initial.selectedFlavor);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));camera.position.z=7.1;
  stage.append(renderer.domElement);stage.classList.add('webgl-ready');
  const bubbleGroup = new THREE.Group();scene.add(bubbleGroup);
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({color:'#effcc8',metalness:.05,roughness:.08,transparent:true,opacity:.34,clearcoat:1});
  for(let i=0;i<9;i++) {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(.035+(i%3)*.014,16,12),bubbleMaterial);
    bubble.position.set(Math.sin(i*4)*1.5,(i/8-.5)*3.8,Math.cos(i*3)*.8-.8);
    bubble.userData.baseY=bubble.position.y;bubbleGroup.add(bubble);
  }
  let paused=initial.paused,visible=true,raf=0,lastTime=0,time=0,pointerX=0,pointerY=0,dragging=false,lastX=0,dragRotation=0,transitionSpin=0;
  function resize() {
    const {width,height}=stage.getBoundingClientRect();if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;
    camera.position.z=camera.aspect<.7?8:7.1;camera.updateProjectionMatrix();renderFrame();
  }
  function renderFrame() {
    can.group.position.y=Math.sin(time*.9)*.075;
    can.group.rotation.set(.24+pointerY*.1, -.12+Math.sin(time*.5)*.14+pointerX*.16+dragRotation+transitionSpin, -.24+Math.sin(time*.7)*.035-pointerX*.04);
    bubbleGroup.children.forEach((bubble,index)=>{bubble.position.y=bubble.userData.baseY+Math.sin(time*.7+index)*.14;});
    renderer.render(scene,camera);
  }
  function tick(now) {
    raf=0;
    if(document.hidden||!visible||paused)return;
    const delta=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;time+=delta;
    transitionSpin*=.9;
    renderFrame();raf=requestAnimationFrame(tick);
  }
  function resume() { if(!raf&&!paused&&visible&&!document.hidden){lastTime=0;raf=requestAnimationFrame(tick);} }
  function pauseFrame() {cancelAnimationFrame(raf);raf=0;lastTime=0;}
  window.addEventListener('zest:flavor',event=>{can.setFlavor(event.detail.index);transitionSpin=paused?0:.9;renderFrame();resume();});
  window.addEventListener('zest:motion',event=>{paused=event.detail.paused;if(paused)pauseFrame();else resume();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseFrame();else resume();});
  stage.addEventListener('pointermove',event=>{
    const rect=stage.getBoundingClientRect();
    if(dragging) {dragRotation+=(event.clientX-lastX)*.009;lastX=event.clientX;renderFrame();}
    else if(!paused&&event.pointerType==='mouse') {pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;}
  });
  stage.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'){dragging=true;lastX=event.clientX;stage.setPointerCapture(event.pointerId);}});
  const stopDrag=()=>{dragging=false;};stage.addEventListener('pointerup',stopDrag);stage.addEventListener('pointercancel',stopDrag);
  stage.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  const resizeObserver = new ResizeObserver(resize);resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else pauseFrame();},{rootMargin:'100px'});
  visibilityObserver.observe(stage);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();pauseFrame();stage.classList.remove('webgl-ready');renderer.domElement.style.display='none';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{renderer.domElement.style.display='';stage.classList.add('webgl-ready');renderFrame();resume();});
  resize();resume();
}
