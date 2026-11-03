
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.getElementById("characterCanvas");
const container = document.getElementById("characterScene");

if (canvas && container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 1.65, 7.5);
  camera.lookAt(0, 1.5, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // LIGHTING
  scene.add(new THREE.HemisphereLight(0xbacaff, 0x17132d, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(3, 5, 5);
  scene.add(keyLight);

  const purpleLight = new THREE.PointLight(0x9670ff, 18, 10);
  purpleLight.position.set(-3, 2, 3);
  scene.add(purpleLight);

  const blueLight = new THREE.PointLight(0x45cfff, 15, 10);
  blueLight.position.set(3, 1, -2);
  scene.add(blueLight);

  // MATERIALS
  const skin = new THREE.MeshStandardMaterial({
    color: 0xe9ae87,
    roughness: 0.75
  });

  const hair = new THREE.MeshStandardMaterial({
    color: 0x24213c,
    roughness: 0.8
  });

  const shirt = new THREE.MeshStandardMaterial({
    color: 0x7661ee,
    roughness: 0.55,
    metalness: 0.1
  });

  const trousers = new THREE.MeshStandardMaterial({
    color: 0x202a48,
    roughness: 0.8
  });

  const shoes = new THREE.MeshStandardMaterial({
    color: 0x55cfff,
    roughness: 0.45
  });

  const white = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });

  const black = new THREE.MeshStandardMaterial({
    color: 0x171727,
    roughness: 0.5
  });

  const character = new THREE.Group();
  scene.add(character);

  function sphere(parent, material, position, scale) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      material
    );

    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  function capsule(parent, material, start, end, radius) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(b, a);

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, direction.length(), 20),
      material
    );

    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    parent.add(mesh);
    sphere(parent, material, start, [radius, radius, radius]);
    sphere(parent, material, end, [radius, radius, radius]);

    return mesh;
  }

  // BODY
  sphere(character, shirt, [0, 1.15, 0], [0.55, 0.68, 0.34]);

  // NECK
  sphere(character, skin, [0, 1.78, 0], [0.17, 0.2, 0.17]);

  // HEAD
  sphere(character, skin, [0, 2.2, 0], [0.48, 0.56, 0.4]);

  // HAIR CAP
  sphere(character, hair, [0, 2.52, -0.035], [0.49, 0.32, 0.4]);

  // FRONT HAIR LOCKS
  sphere(character, hair, [-0.25, 2.43, 0.29], [0.19, 0.25, 0.17]);
  sphere(character, hair, [0.03, 2.48, 0.34], [0.2, 0.2, 0.15]);
  sphere(character, hair, [0.27, 2.42, 0.25], [0.16, 0.22, 0.15]);

  // EYES
  sphere(character, white, [-0.19, 2.22, 0.365], [0.105, 0.13, 0.06]);
  sphere(character, white, [0.19, 2.22, 0.365], [0.105, 0.13, 0.06]);

  sphere(character, black, [-0.18, 2.21, 0.418], [0.052, 0.075, 0.025]);
  sphere(character, black, [0.2, 2.21, 0.418], [0.052, 0.075, 0.025]);

  // SMILE
  const smilePoints = [
    new THREE.Vector3(-0.105, 2.01, 0.385),
    new THREE.Vector3(0, 1.97, 0.414),
    new THREE.Vector3(0.105, 2.01, 0.385)
  ];

  const smileCurve = new THREE.QuadraticBezierCurve3(
    smilePoints[0],
    smilePoints[1],
    smilePoints[2]
  );

  const smile = new THREE.Mesh(
    new THREE.TubeGeometry(smileCurve, 20, 0.014, 8, false),
    black
  );
  character.add(smile);

  // ARMS
  capsule(character, shirt, [-0.47, 1.5, 0], [-0.75, 1.15, 0.02], 0.14);
  capsule(character, skin, [-0.75, 1.15, 0.02], [-0.78, 1.02, 0.12], 0.105);

  capsule(character, shirt, [0.47, 1.5, 0], [0.78, 1.78, 0.02], 0.14);
  capsule(character, skin, [0.78, 1.78, 0.02], [0.83, 2.0, 0.12], 0.105);

  // LEGS
  capsule(character, trousers, [-0.22, 0.65, 0], [-0.24, 0.18, 0], 0.17);
  capsule(character, trousers, [0.22, 0.65, 0], [0.24, 0.18, 0], 0.17);

  sphere(character, shoes, [-0.24, 0.08, 0.12], [0.23, 0.11, 0.32]);
  sphere(character, shoes, [0.24, 0.08, 0.12], [0.23, 0.11, 0.32]);

  // DECORATIVE ORBIT
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.012, 12, 120),
    new THREE.MeshBasicMaterial({
      color: 0x9b87ff,
      transparent: true,
      opacity: 0.7
    })
  );

  orbit.rotation.x = Math.PI / 2.7;
  orbit.position.y = 1.25;
  scene.add(orbit);

  // FLOATING STARS
  const stars = [];

  for (let i = 0; i < 14; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? 0x55d6ff : 0xb49aff
      })
    );

    star.position.set(
      (Math.random() - 0.5) * 4.5,
      Math.random() * 3.5,
      (Math.random() - 0.5) * 1.5
    );

    scene.add(star);
    stars.push(star);
  }

  // POINTER INTERACTION
  let pointerX = 0;
  let pointerY = 0;

  container.addEventListener("pointermove", (event) => {
    const rect = container.getBoundingClientRect();

    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.35;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.2;
  });

  container.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  // RESIZE
  function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(container);

  // ANIMATION
  const clock = new THREE.Clock();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (!reduceMotion) {
      character.position.y = Math.sin(time * 1.6) * 0.07;
      character.rotation.y += (pointerX - character.rotation.y) * 0.035;
      character.rotation.x += (-pointerY - character.rotation.x) * 0.035;

      // Friendly waving motion
      character.children.forEach((part) => {
        if (part.position.x > 0.7 && part.position.y > 1.7) {
          part.rotation.z = Math.sin(time * 4) * 0.08;
        }
      });

      orbit.rotation.z = time * 0.12;

      stars.forEach((star, index) => {
        star.position.y += Math.sin(time + index) * 0.0015;
      });
    }

    renderer.render(scene, camera);
  }

  animate();
}
