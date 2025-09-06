// Neural Code Nexus - Interactive JavaScript
class NeuralCodeNexus {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.neurons = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createNeuralNetwork();
        this.setupEventListeners();
        this.animate();
        this.setupFilterSystem();
        this.setupScrollAnimations();
        this.setupGlitchEffects();
    }

    setupCanvas() {
        this.canvas = document.getElementById('neural-bg');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNeuralNetwork() {
        const neuronCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        this.neurons = [];
        this.connections = [];

        // Create neurons
        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                brightness: Math.random() * 0.8 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }

        // Create connections
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const distance = this.getDistance(this.neurons[i], this.neurons[j]);
                if (distance < 150) {
                    this.connections.push({
                        neuron1: this.neurons[i],
                        neuron2: this.neurons[j],
                        distance: distance,
                        strength: (150 - distance) / 150
                    });
                }
            }
        }
    }

    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    updateNeurons() {
        this.neurons.forEach(neuron => {
            // Update position
            neuron.x += neuron.vx;
            neuron.y += neuron.vy;

            // Bounce off walls
            if (neuron.x <= 0 || neuron.x >= this.canvas.width) neuron.vx *= -1;
            if (neuron.y <= 0 || neuron.y >= this.canvas.height) neuron.vy *= -1;

            // Update brightness pulse
            neuron.brightness += neuron.pulseSpeed;
            if (neuron.brightness > 1 || neuron.brightness < 0.2) {
                neuron.pulseSpeed *= -1;
            }
        });
    }

    drawNeuralNetwork() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.connections.forEach(connection => {
            const opacity = connection.strength * 0.3;
            const gradient = this.ctx.createLinearGradient(
                connection.neuron1.x, connection.neuron1.y,
                connection.neuron2.x, connection.neuron2.y
            );
            gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 0, 128, ${opacity})`);
            gradient.addColorStop(1, `rgba(128, 0, 255, ${opacity})`);

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = connection.strength * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.neuron1.x, connection.neuron1.y);
            this.ctx.lineTo(connection.neuron2.x, connection.neuron2.y);
            this.ctx.stroke();
        });

        // Draw neurons
        this.neurons.forEach(neuron => {
            const gradient = this.ctx.createRadialGradient(
                neuron.x, neuron.y, 0,
                neuron.x, neuron.y, neuron.size * 3
            );
            gradient.addColorStop(0, `rgba(0, 255, 255, ${neuron.brightness})`);
            gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw neuron core
            this.ctx.fillStyle = `rgba(255, 255, 255, ${neuron.brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, neuron.size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.updateNeurons();
        this.drawNeuralNetwork();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Mouse tracking for interactive effects
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createMouseInteraction();
        });

        // Project card hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.enhanceCard(card));
            card.addEventListener('mouseleave', () => this.normalizeCard(card));
        });

        // Button click effects
        const quantumButtons = document.querySelectorAll('.btn-quantum');
        quantumButtons.forEach(button => {
            button.addEventListener('click', (e) => this.createQuantumRipple(e, button));
        });
    }

    createMouseInteraction() {
        // Find nearest neurons to mouse and create temporary connections
        const nearbyNeurons = this.neurons.filter(neuron => {
            const distance = this.getDistance(neuron, this.mouse);
            return distance < 100;
        });

        nearbyNeurons.forEach(neuron => {
            neuron.brightness = Math.min(1, neuron.brightness + 0.02);
            neuron.vx += (this.mouse.x - neuron.x) * 0.00001;
            neuron.vy += (this.mouse.y - neuron.y) * 0.00001;
        });
    }

    enhanceCard(card) {
        // Add quantum particle effects
        this.createQuantumParticles(card);
        
        // Enhance hologram effect
        const hologram = card.querySelector('.card-hologram');
        if (hologram) {
            hologram.style.opacity = '0.2';
        }
    }

    normalizeCard(card) {
        // Remove particle effects
        const particles = card.querySelectorAll('.quantum-particle');
        particles.forEach(particle => particle.remove());
        
        // Reset hologram
        const hologram = card.querySelector('.card-hologram');
        if (hologram) {
            hologram.style.opacity = '0';
        }
    }

    createQuantumParticles(container) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: #00ffff;
                border-radius: 50%;
                pointer-events: none;
                animation: quantum-float 2s linear infinite;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                z-index: 10;
            `;
            
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }

    createQuantumRipple(event, button) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.3);
            transform: scale(0);
            animation: quantum-ripple 0.6s linear;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupFilterSystem() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                
                // Filter projects with animation
                projectCards.forEach((card, index) => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        setTimeout(() => {
                            card.classList.remove('hidden');
                        }, index * 50);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fade-in-up 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupGlitchEffects() {
        const glitchTitle = document.querySelector('.title-glitch');
        
        // Random glitch trigger
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                glitchTitle.style.animation = 'none';
                setTimeout(() => {
                    glitchTitle.style.animation = '';
                }, 50);
            }
        }, 3000);

        // Data stream animation
        const dataStreams = document.querySelectorAll('.data-stream');
        dataStreams.forEach(stream => {
            setInterval(() => {
                const sequences = ['01010101', '11001100', '10101010', '00110011', '11110000', '00001111'];
                stream.textContent = sequences[Math.floor(Math.random() * sequences.length)];
            }, 500);
        });
        
        // Animate tech indicators
        const techCounts = document.querySelectorAll('.tech-count-small');
        techCounts.forEach((count, index) => {
            setInterval(() => {
                count.style.transform = `scale(${1 + Math.sin(Date.now() * 0.003 + index) * 0.1})`;
            }, 50);
        });
        
        // Matrix rain effect on canvas
        this.addMatrixRain();
    }
    
    addMatrixRain() {
        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const drops = [];
        const dropCount = Math.floor(this.canvas.width / 20);
        
        // Initialize drops
        for (let i = 0; i < dropCount; i++) {
            drops.push({
                x: i * 20,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1,
                char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
            });
        }
        
        // Update matrix rain
        const updateMatrixRain = () => {
            drops.forEach(drop => {
                drop.y += drop.speed;
                if (drop.y > this.canvas.height) {
                    drop.y = -20;
                    drop.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }
                
                // Draw matrix character
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
                this.ctx.font = '12px monospace';
                this.ctx.fillText(drop.char, drop.x, drop.y);
            });
        };
        
        // Add to main animation loop
        const originalAnimate = this.animate.bind(this);
        this.animate = () => {
            this.updateNeurons();
            updateMatrixRain();
            this.drawNeuralNetwork();
            this.animationId = requestAnimationFrame(() => this.animate());
        };
    }
}

// CSS Animations (injected dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes quantum-float {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes quantum-ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    .quantum-particle {
        box-shadow: 0 0 10px #00ffff;
    }
    
    .project-card.hidden {
        opacity: 0 !important;
        transform: scale(0.8) !important;
        pointer-events: none !important;
    }
`;
document.head.appendChild(style);

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        
        this.monitor();
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime > this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Optimize based on performance
            if (this.fps < 30) {
                this.optimizePerformance();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    optimizePerformance() {
        // Reduce particle effects on low performance
        const particles = document.querySelectorAll('.quantum-particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) particle.remove();
        });
    }
}

// Touch device optimizations
class TouchOptimizer {
    constructor() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (this.isTouchDevice) {
            this.optimizeForTouch();
        }
    }
    
    optimizeForTouch() {
        // Disable hover effects on touch devices
        document.body.classList.add('touch-device');
        
        // Add touch-specific styles
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .touch-device .project-card:hover {
                transform: none;
            }
            
            .touch-device .project-card {
                transition: transform 0.2s ease;
            }
            
            .touch-device .project-card:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(touchStyle);
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupReducedMotion();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels for better screen reader support
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const title = card.querySelector('.project-title').textContent;
            card.setAttribute('aria-label', `Project: ${title}`);
            card.setAttribute('role', 'article');
        });
    }
    
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
            
            const reducedMotionStyle = document.createElement('style');
            reducedMotionStyle.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(reducedMotionStyle);
        }
    }
}

// Enhanced error handling
class ErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Neural Code Nexus Error:', e.error);
            this.displayFallback();
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
    
    displayFallback() {
        // Graceful fallback for critical errors
        const canvas = document.getElementById('neural-bg');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        new NeuralCodeNexus();
        new PerformanceMonitor();
        new TouchOptimizer();
        new AccessibilityEnhancer();
        new ErrorHandler();
        
        // Loading animation
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
        
        console.log('🚀 Neural Code Nexus initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize Neural Code Nexus:', error);
        // Fallback to basic functionality
        document.body.classList.add('fallback-mode');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeuralCodeNexus, PerformanceMonitor, TouchOptimizer, AccessibilityEnhancer };
}