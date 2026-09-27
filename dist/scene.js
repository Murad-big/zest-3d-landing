import * as THREE from './vendor/three.module.js';
import { flavors } from './data.js';
import { createCitrus } from './citrus.js';

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
  ctx.textAlign = 'center'; ctx.font = '700 64px Golos, Arial';
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
  const aluminum = new THREE.MeshStandardMaterial({ color: '#f1f3f1', roughness: .2, metalness: 1, envMapIntensity: 1.5 });
  const lidMetal = new THREE.MeshStandardMaterial({ color: '#d5d9d6', roughness: .29, metalness: .95, envMapIntensity: 1.2 });
  const label = new THREE.MeshPhysicalMaterial({ map: textures[0], roughness: .3, metalness: .08, clearcoat: .8, clearcoatRoughness: .17 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.68, .68, 2.95, 96, 1, true), label);
  body.rotation.y = Math.PI;
  group.add(body);
  const shoulderMaterial = new THREE.MeshPhysicalMaterial({ color: flavors[0].color, roughness: .3, metalness: .08, clearcoat: .8, clearcoatRoughness: .17 });
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
  const dropMaterial = new THREE.MeshPhysicalMaterial({color:'#e3e8da',metalness:0,roughness:.05,transparent:true,opacity:.28,clearcoat:1,envMapIntensity:1.6});
  const droplets = new THREE.InstancedMesh(dropGeometry,dropMaterial,185);
  const dummy = new THREE.Object3D();
  for(let i=0;i<185;i++) {
    const a=i*2.399963; const y=((i*47)%103)/103*2.7-1.35;
    const size=.005+(i%9)*.0018;
    dummy.position.set(Math.sin(a)*.681,y,Math.cos(a)*.681);
    dummy.scale.set(size,size*1.3,size*.7);dummy.lookAt(0,y,0);dummy.updateMatrix();
    droplets.setMatrixAt(i,dummy.matrix);
  }
  group.add(droplets);
  return { group, setFlavor(index) { label.map=textures[index]; shoulderMaterial.color.set(flavors[index].color); } };
}

function studioEnvironment(renderer) {
  const room = new THREE.Scene();room.background = new THREE.Color('#777777');
  function panel(x,y,z,width,height,intensity) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity),side:THREE.DoubleSide}));
    mesh.position.set(x,y,z);mesh.lookAt(0,0,0);room.add(mesh);
  }
  panel(-3,2,4,2,7,4);panel(4,1,1,.8,6,4);panel(0,6,0,5,5,3);panel(0,1,-5,5,5,.08);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(room,.02);pmrem.dispose();
  room.traverse(object => { object.geometry?.dispose();object.material?.dispose(); });
  return env;
}

export async function initScene(initial) {
  await document.fonts.ready;
  const stage = document.getElementById('product-stage');
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=.85;
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene = new THREE.Scene();
  const environment = studioEnvironment(renderer);scene.environment = environment.texture;scene.environmentIntensity=.5;
  const camera = new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,.25,7.1);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xcccccc,1.6));
  const keyLight = new THREE.DirectionalLight(0xffffff,2.2);keyLight.position.set(-3,5,6);scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff,1);fillLight.position.set(4,1,-3);scene.add(fillLight);
  const textures = flavors.map(flavor => labelTexture(flavor,renderer));
  const can = createCan(textures);scene.add(can.group);
  let citrus = null;
  const applyFlavor = index => { can.setFlavor(index); citrus?.setFlavor(index); };
  // Collection images are pre-rendered assets; startup only prepares the live hero.
  const state = initial.getState();
  can.setFlavor(state.selectedFlavor);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));camera.position.z=7.1;
  stage.append(renderer.domElement);stage.classList.add('webgl-ready');
  window.dispatchEvent(new CustomEvent('zest:scene', { detail: { available: true } }));
  const bubbleGroup = new THREE.Group();scene.add(bubbleGroup);
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({color:'#effcc8',metalness:.05,roughness:.08,transparent:true,opacity:.34,clearcoat:1});
  for(let i=0;i<9;i++) {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(.035+(i%3)*.014,16,12),bubbleMaterial);
    bubble.position.set(Math.sin(i*4)*1.5,(i/8-.5)*3.8,Math.cos(i*3)*.8-.8);
    bubble.userData.baseY=bubble.position.y;bubbleGroup.add(bubble);
  }
  let paused=state.paused,overlayOpen=state.dialogOpen,visible=true,contextLost=false,raf=0,lastTime=0,time=0;
  let pointerX=0,pointerY=0,targetX=0,targetY=0,dragging=false,lastX=0;
  let dragRotation=0,targetRotation=0,spin=0,scrollProgress=0;
  let flavorTween=null,currentFlavor=state.selectedFlavor;
  // Decorative assets arrive after the usable can; failure leaves the core scene intact.
  createCitrus(renderer).then(asset => {
    citrus = asset; citrus.setFlavor(currentFlavor); scene.add(citrus.group);
    stage.classList.add('citrus-ready'); renderFrame();
  }).catch(() => { /* Keep the product interactive when a decorative asset cannot load. */ });
  const shadow=document.querySelector('.product-shadow');
  function resize() {
    const {width,height}=stage.getBoundingClientRect();if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;
    camera.position.z=camera.aspect<.7?8:7.1;camera.updateProjectionMatrix();renderFrame();
  }
  function renderFrame() {
    if(contextLost)return;
    const float=Math.sin(time*.9)*.07;
    can.group.position.y=float-scrollProgress*.14;
    can.group.rotation.set(.3+pointerY*.12, -.12+Math.sin(time*.5)*.14+pointerX*.2+dragRotation+spin, -.27+Math.sin(time*.7)*.035-pointerX*.035-scrollProgress*.1);
    shadow.style.transform=`rotate(-6deg) scale(${1-float*.5})`;
    shadow.style.opacity=String(.8-float*1.7);
    bubbleGroup.children.forEach((bubble,index)=>{bubble.position.y=bubble.userData.baseY+Math.sin(time*.7+index)*.14;});
    citrus?.update(time, pointerX, spin);
    renderer.render(scene,camera);
  }
  function tick(now) {
    raf=0;
    if(document.hidden||!visible||paused||overlayOpen||contextLost)return;
    const delta=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;time+=delta;
    const damping=1-Math.exp(-delta*7);
    pointerX+=(targetX-pointerX)*damping;pointerY+=(targetY-pointerY)*damping;
    dragRotation+=(targetRotation-dragRotation)*damping;
    if(flavorTween){
      flavorTween.elapsed+=delta;
      const progress=Math.min(flavorTween.elapsed/.8,1);
      spin=Math.sin(progress*Math.PI)*.72;
      if(progress>=.48&&!flavorTween.swapped){applyFlavor(flavorTween.index);currentFlavor=flavorTween.index;flavorTween.swapped=true;}
      if(progress===1){flavorTween=null;spin=0;}
    }
    renderFrame();raf=requestAnimationFrame(tick);
  }
  function resume() { if(!raf&&!paused&&!overlayOpen&&visible&&!document.hidden&&!contextLost){lastTime=0;raf=requestAnimationFrame(tick);} }
  function pauseFrame() {cancelAnimationFrame(raf);raf=0;lastTime=0;}
  window.addEventListener('zest:flavor',event=>{
    const index=event.detail.index;
    targetRotation=0;
    if(paused||!visible||document.hidden){applyFlavor(index);currentFlavor=index;flavorTween=null;spin=0;dragRotation=0;renderFrame();}
    else if(index!==currentFlavor||flavorTween){flavorTween={index,elapsed:0,swapped:false};resume();}
  });
  window.addEventListener('zest:motion',event=>{
    paused=event.detail.paused;
    if(paused){pauseFrame();if(flavorTween){applyFlavor(flavorTween.index);currentFlavor=flavorTween.index;flavorTween=null;spin=0;}renderFrame();}
    else resume();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseFrame();else resume();});
  window.addEventListener('zest:dialog',event=>{overlayOpen=event.detail.open;if(overlayOpen)pauseFrame();else resume();});
  stage.addEventListener('pointermove',event=>{
    const rect=stage.getBoundingClientRect();
    if(dragging) {targetRotation+=(event.clientX-lastX)*.009;lastX=event.clientX;if(paused){dragRotation=targetRotation;renderFrame();}}
    else if(!paused&&event.pointerType==='mouse') {targetX=(event.clientX-rect.left)/rect.width-.5;targetY=(event.clientY-rect.top)/rect.height-.5;}
  });
  stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;dragging=true;lastX=event.clientX;stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');});
  const stopDrag=()=>{dragging=false;stage.classList.remove('is-dragging');};stage.addEventListener('pointerup',stopDrag);stage.addEventListener('pointercancel',stopDrag);stage.addEventListener('lostpointercapture',stopDrag);
  stage.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
  stage.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;
    event.preventDefault();targetRotation=event.key==='Home'?0:targetRotation+(event.key==='ArrowRight'?.35:-.35);
    if(paused){dragRotation=targetRotation;renderFrame();}else resume();
  });
  window.addEventListener('scroll',()=>{if(!paused)scrollProgress=Math.min(1,Math.max(0,scrollY/(stage.clientHeight||1)));},{passive:true});
  const resizeObserver = new ResizeObserver(resize);resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else pauseFrame();},{rootMargin:'100px'});
  visibilityObserver.observe(stage);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;pauseFrame();stage.classList.remove('webgl-ready');renderer.domElement.style.display='none';window.dispatchEvent(new CustomEvent('zest:scene',{detail:{available:false}}));});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;renderer.domElement.style.display='';stage.classList.add('webgl-ready');window.dispatchEvent(new CustomEvent('zest:scene',{detail:{available:true}}));renderFrame();resume();});
  resize();resume();
}
