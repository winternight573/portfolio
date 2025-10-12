/**
 * Hero Background Animation with Three.js
 * Subtle particle system for portfolio hero section
 */
"use strict";

(function() {
  // Only run on index page
  if (!document.getElementById('hero-canvas')) return;

  // Check if device can handle Three.js (skip on mobile for performance)
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    console.log('Three.js disabled on mobile for performance');
    return;
  }

  // Three.js Scene Setup
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true,
    antialias: true 
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
  renderer.setClearColor(0xdbe9ee, 1);
  
  camera.position.z = 50;

  /* ==========================================
     PARTICLE SYSTEM
     ========================================== */
  const particleCount = 800;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  // PNW color palette
  const colorPalette = [
    { r: 0.23, g: 0.41, b: 0.47 }, // #3b6978
    { r: 0.35, g: 0.55, b: 0.62 }, // #5a8d9d
    { r: 0.13, g: 0.31, b: 0.35 }, // #204e5a
    { r: 0.66, g: 0.77, b: 0.84 }, // #a8c0d6
  ];
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Spread particles in space
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = (Math.random() - 0.5) * 100;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;
    
    // Random color from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    // Random sizes
    sizes[i] = Math.random() * 2 + 0.5;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  /* ==========================================
     CONNECTING LINES (Optional)
     ========================================== */
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = [];
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3b6978,
    transparent: true,
    opacity: 0.15
  });

  function updateConnections() {
    linePositions.length = 0;
    const positions = particleSystem.geometry.attributes.position.array;
    const maxDistance = 15;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      for (let j = i + 1; j < particleCount; j++) {
        const j3 = j * 3;
        
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < maxDistance) {
          linePositions.push(
            positions[i3], positions[i3 + 1], positions[i3 + 2],
            positions[j3], positions[j3 + 1], positions[j3 + 2]
          );
        }
      }
    }
    
    lineGeometry.setAttribute('position', 
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
  }

  const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSystem);

  /* ==========================================
     MOUSE INTERACTION
     ========================================== */
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotation.x = mouse.y * 0.2;
    targetRotation.y = mouse.x * 0.2;
  });

  /* ==========================================
     ANIMATION LOOP
     ========================================== */
  let time = 0;
  let frameCount = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;
    frameCount++;
    
    // Smooth rotation following mouse
    particleSystem.rotation.x += (targetRotation.x - particleSystem.rotation.x) * 0.05;
    particleSystem.rotation.y += (targetRotation.y - particleSystem.rotation.y) * 0.05;
    
    // Gentle continuous rotation
    particleSystem.rotation.y += 0.0005;
    
    // Animate individual particles
    const positions = particleSystem.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Wave motion
      const wave = Math.sin(time + i * 0.01) * 0.5;
      positions[i + 1] += wave * 0.02;
      
      // Boundary wrapping
      if (positions[i + 1] > 50) positions[i + 1] = -50;
      if (positions[i + 1] < -50) positions[i + 1] = 50;
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Update connections every 5 frames (performance optimization)
    if (frameCount % 5 === 0) {
      updateConnections();
    }
    
    // Subtle camera movement
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.position.y = Math.cos(time * 0.15) * 2;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();

  /* ==========================================
     RESPONSIVE HANDLING
     ========================================== */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ==========================================
     PERFORMANCE MONITORING
     ========================================== */
  let lastTime = performance.now();
  let frames = 0;
  
  function checkPerformance() {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      
      // Reduce particle count if FPS drops below 30
      if (fps < 30 && particleCount > 400) {
        console.log('Reducing particles for performance');
        // Implement particle reduction logic here if needed
      }
      
      frames = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(checkPerformance);
  }
  
  checkPerformance();

})();