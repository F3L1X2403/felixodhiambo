// PWA Install Script
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', (e) => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', (e) => {
  console.log('App was installed');
});

// Show welcome toast after 5 seconds
setTimeout(() => {
  document.getElementById('welcomeToast').classList.add('show');
  // Auto hide after 8 seconds
  setTimeout(() => {
    closeToast();
  }, 8000);
}, 5000);

function closeToast() {
  document.getElementById('welcomeToast').classList.remove('show');
}

// Typed.js
new Typed("#text", {
  strings: ["Data Solutions Architect.", "Data Scientist.", "Strategy Analyst."],
  loop: true,
  typeSpeed: 80,
  backSpeed: 50,
  backDelay: 1200,
  onStringTyped: function(arrayPos, self) {
    if (document.body.classList.contains('night')) {
      self.el.style.color = 'var(--color-secondary)';
    } else {
      self.el.style.color = 'var(--color-accent)';
    }
  }
});

// Dark mode
document.querySelector('.darkmode').addEventListener('click', () => {
  document.body.classList.toggle('night');
  const icon = document.querySelector('.darkmode i');
  if (document.body.classList.contains('night')) {
    icon.classList.remove('bx-moon');
    icon.classList.add('bx-sun');
  } else {
    icon.classList.remove('bx-sun');
    icon.classList.add('bx-moon');
  }
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
    const res = await fetch('https://formspree.io/f/mjkjbngk', {
      method: 'POST',
      body: new FormData(e.target),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      msg.style.color = 'blue';
      msg.textContent = 'Message Sent to Felix Successfully';
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

// ===== TESTIMONIALS CAROUSEL =====
(function() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  showSlide(0);
  startAutoPlay();

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoPlay();
      showSlide(index);
      startAutoPlay();
    });
  });

  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }
})();

// ===== BACKGROUND INTERACTIVE ANIMATION =====
(function() {
  // Delay Three.js animation initialization until after page load
  let animationInitialized = false;

  function initBackgroundAnimation() {
    if (animationInitialized) return;
    animationInitialized = true;

    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false, // Disable antialiasing for better performance
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Reduce particle count for better performance
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      colors[i * 3] = 0.4 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      sizes[i] = Math.random() * 2 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          mvPosition.y += sin(time * 0.001 + position.x * 0.01) * 2.0;
          mvPosition.x += cos(time * 0.001 + position.z * 0.01) * 1.0;
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Reduce shape count for better performance
    const shapes = [];
    const shapeCount = 4;

    for (let i = 0; i < shapeCount; i++) {
      const geometry = Math.random() > 0.5 ? new THREE.BoxGeometry(4, 4, 4) : new THREE.SphereGeometry(3, 8, 6);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6, 0.3, 0.4 + Math.random() * 0.3),
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 200
      );
      shapes.push(shape);
      scene.add(shape);
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    scene.add(directionalLight);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
    });

    let frame = 0;
    let lastTime = 0;
    const fpsLimit = 30; // Limit to 30 FPS for better performance
    const frameInterval = 1000 / fpsLimit;

    function animate(currentTime) {
      requestAnimationFrame(animate);

      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      frame++;

      target.x += (mouse.x * 50 - target.x) * 0.05;
      target.y += (mouse.y * 50 - target.y) * 0.05;

      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x = target.y * 0.005;

      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.002 * (index % 2 ? 1 : -1);
        shape.rotation.y += 0.003 * (index % 2 ? -1 : 1);
      });

      particleMaterial.uniforms.time.value = frame;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });

    document.querySelector('.darkmode').addEventListener('click', function() {
      setTimeout(() => {
        const isDark = document.body.classList.contains('night') || document.body.classList.contains('dark-mode');
        const particleColors = particleSystem.geometry.attributes.color;
        for (let i = 0; i < particleCount; i++) {
          particleColors.array[i * 3] = isDark ? 0.6 : 0.4;
          particleColors.array[i * 3 + 1] = isDark ? 0.8 : 0.6;
          particleColors.array[i * 3 + 2] = isDark ? 1.0 : 0.8;
        }
        particleColors.needsUpdate = true;

        shapes.forEach((shape) => {
          shape.material.color.setHSL(
            isDark ? 0.65 : 0.55,
            0.4,
            isDark ? 0.6 : 0.4
          );
          shape.material.opacity = isDark ? 0.15 : 0.08;
        });
      }, 100);
    });
  }

  // Initialize animation after page load
  window.addEventListener('load', () => {
    setTimeout(initBackgroundAnimation, 1000); // Delay by 1 second after load
  });
})();


// Register Service Worker (only on http/https)
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  });
}