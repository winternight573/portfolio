/**
 * Portfolio Interactive Animations
 * Handles scroll animations, project card previews, and smooth transitions
 */
"use strict";

(function () {
  window.addEventListener("load", initInteractions);

  function initInteractions() {
    setupScrollAnimations();
    setupProjectCardPreviews();
    setupSmoothScrolling();
    setupPageTransitions();
    setupParallaxEffects();
  }

  /* ==========================================
     SCROLL ANIMATIONS
     Elements fade in as you scroll
     ========================================== */
  function setupScrollAnimations() {
    const sections = document.querySelectorAll(
      "#featured, #projects, #contact, #about-story, #skills, #cta, .resume-section"
    );

    sections.forEach(section => {
      section.classList.add("fade-in-section");
    });

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Animate individual cards with stagger
    const cards = document.querySelectorAll(".project-card, .skill-category, .resume-item");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("fade-in-card");
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    cards.forEach(card => cardObserver.observe(card));
  }

  /* ==========================================
     PROJECT CARD PREVIEWS
     Show hover videos/GIFs if available
     ========================================== */
  function setupProjectCardPreviews() {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {
      const img = card.querySelector("img");
      if (!img) return;

      const staticSrc = img.src;
      const previewSrc = img.dataset.preview; // Add data-preview="path/to/preview.gif" in HTML

      if (previewSrc) {
        // Preload the preview
        const previewImg = new Image();
        previewImg.src = previewSrc;

        card.addEventListener("mouseenter", () => {
          img.src = previewSrc;
          img.style.objectFit = "cover";
        });

        card.addEventListener("mouseleave", () => {
          img.src = staticSrc;
        });
      }

      // Add click ripple effect
      card.addEventListener("click", function(e) {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ==========================================
     SMOOTH SCROLLING
     For anchor links and navigation
     ========================================== */
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for sticky nav
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
          });
        }
      });
    });

    // Scroll indicator animation
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", () => {
        const featuredSection = document.querySelector("#featured");
        if (featuredSection) {
          featuredSection.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Hide scroll indicator after scrolling
      let scrollTimeout;
      window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = "0";
          scrollIndicator.style.pointerEvents = "none";
        } else {
          scrollIndicator.style.opacity = "1";
          scrollIndicator.style.pointerEvents = "auto";
        }
      });
    }
  }

  /* ==========================================
     PAGE TRANSITIONS
     Smooth fade when navigating between pages
     ========================================== */
  function setupPageTransitions() {
    // Fade in on page load
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);

    // Fade out on navigation
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
    
    links.forEach(link => {
      link.addEventListener("click", function(e) {
        if (this.hostname === window.location.hostname) {
          e.preventDefault();
          const destination = this.href;
          
          document.body.style.opacity = "0";
          
          setTimeout(() => {
            window.location.href = destination;
          }, 300);
        }
      });
    });
  }

  /* ==========================================
     PARALLAX EFFECTS
     Subtle movement on scroll for depth
     ========================================== */
  function setupParallaxEffects() {
    const heroContent = document.querySelector("#hero-content");
    const aboutPhoto = document.querySelector(".about-photo");
    
    let ticking = false;
    
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          
          if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
          }
          
          if (aboutPhoto) {
            const rect = aboutPhoto.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
              aboutPhoto.style.transform = `translateY(${scrollPercent * -20}px)`;
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }

  /* ==========================================
     CURSOR TRAIL EFFECT (Optional)
     Subtle particle trail following cursor
     ========================================== */
  function setupCursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const maxParticles = 50;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
        if (this.size > 0.2) this.size -= 0.05;
      }

      draw() {
        ctx.fillStyle = `rgba(59, 105, 120, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    window.addEventListener('mousemove', (e) => {
      if (particles.length < maxParticles) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Uncomment to enable cursor trail
  // setupCursorTrail();

})();