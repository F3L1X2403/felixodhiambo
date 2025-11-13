
  // Show welcome toast after 2 seconds
  setTimeout(() => {
    document.getElementById('welcomeToast').classList.add('show');
    // Auto hide after 5 seconds
    setTimeout(() => {
      closeToast();
    }, 5000);
  }, 2000);

  function closeToast() {
    document.getElementById('welcomeToast').classList.remove('show');
  }

  // Typed.js
  new Typed("#text", {
    strings: ["Full-stack Developer.", "Software Engineer.", "AI/ML Engineer."],
    loop: true,
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1200
  });

  // Dark mode
  document.querySelector('.darkmode').addEventListener('click', () => {
    document.body.classList.toggle('night');
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link, .contact-button-nav').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // Scroll to top
  const scrollToTop = document.querySelector('.scroll-to-up');
  window.addEventListener('scroll', () => {
    scrollToTop.classList.toggle('show', window.scrollY > 300);
  });

  // Contact form
  document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const msg = document.getElementById('form-message');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    msg.textContent = '';

    try {
      const res = await fetch('https://formspree.io/f/xzzknyvl', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        msg.style.color = '#0f0';
        msg.textContent = 'Message sent to Joseph successfully.';
        e.target.reset();
      } else {
        throw new Error();
      }
    } catch {
      msg.style.color = '#ff4444';
      msg.textContent = 'Failed to send. Please try again or email me directly.';
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });

  // ===== 3D INTERACTIVE PARTICLE SPHERE =====
  (function() {
    const canvas = document.getElementById('cube-canvas');
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 300;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    
    // Create particle sphere
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const radius = 100;
    const isDark = document.body.classList.contains('night') || document.body.classList.contains('dark-mode');
    
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles on sphere surface using Fibonacci sphere algorithm
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Green color with variations
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
    });
    
    // Animation
    let frame = 0;
    function animate() {
      requestAnimationFrame(animate);
      frame++;
      
      // Smooth mouse follow
      target.x += (mouse.x * 50 - target.x) * 0.05;
      target.y += (mouse.y * 50 - target.y) * 0.05;
      
      // Rotate sphere
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x = target.y * 0.01;
      particleSystem.rotation.y += target.x * 0.0005;
      
      // Pulse effect
      const scale = 1 + Math.sin(frame * 0.01) * 0.05;
      particleSystem.scale.set(scale, scale, scale);
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });
    
    // Update colors on theme change
    document.querySelector('.darkmode').addEventListener('click', function() {
      setTimeout(() => {
        const isDark = document.body.classList.contains('night') || document.body.classList.contains('dark-mode');
        const colorAttr = particles.getAttribute('color');
        for (let i = 0; i < particleCount; i++) {
          colorAttr.array[i * 3 + 1] = isDark ? 0.8 + Math.random() * 0.2 : 0.7 + Math.random() * 0.3;
        }
        colorAttr.needsUpdate = true;
      }, 100);
    });
  })();
