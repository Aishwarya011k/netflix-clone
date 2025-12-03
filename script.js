/**
 * Performance Optimization Script for Netflix Clone
 * Implements:
 * - Lazy loading for images
 * - Request Animation Frame for smooth animations
 * - Intersection Observer for viewport detection
 * - Resource timing monitoring
 */

(function() {
    'use strict';

    // Lazy Loading Implementation using Intersection Observer
    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Optimize smooth scrolling performance
    function optimizeScrolling() {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    // Perform scroll-related calculations here
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Monitor and log performance metrics
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            try {
                const perfObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach((entry) => {
                        if (entry.duration > 3000) {
                            console.warn(`Long task detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                        }
                    });
                });
                
                perfObserver.observe({ entryTypes: ['longtask', 'measure'] });
            } catch (e) {
                console.log('Performance observer not fully supported');
            }
        }

        // Log Core Web Vitals
        if ('web-vital' in window) {
            window.addEventListener('load', function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            });
        }
    }

    // Defer non-critical CSS and async load web fonts
    function optimizeFontLoading() {
        if ('FontFaceSet' in window) {
            document.fonts.ready.then(function() {
                console.log('Web fonts loaded');
            });
        }
    }

    // Enable hardware acceleration for animations
    function enableGPUAcceleration() {
        const style = document.createElement('style');
        style.textContent = `
            .img1, .b1, .b2, .e1, .e2, nav, main, footer {
                will-change: transform;
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
                -webkit-font-smoothing: antialiased;
                -webkit-perspective: 1000;
                perspective: 1000;
            }
        `;
        document.head.appendChild(style);
    }

    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = [
            'vecteezy_netflix-transparent-png-netflix-free-png_19956187.png',
            'logo2.jpg'
        ];

        criticalImages.forEach(imageSrc => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imageSrc;
            document.head.appendChild(link);
        });
    }

    // Optimize animation performance using requestAnimationFrame
    function optimizeAnimations() {
        const animatedElements = document.querySelectorAll('[class*="slide"], [class*="fade"], [class*="scale"]');
        
        let animationFrameId;
        function optimizeFrame() {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.willChange = 'transform, opacity';
                } else {
                    el.style.willChange = 'auto';
                }
            });
            animationFrameId = requestAnimationFrame(optimizeFrame);
        }
        
        optimizeFrame();
    }

    // Initialize all optimizations when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeLazyLoading();
                optimizeScrolling();
                optimizeFontLoading();
                enableGPUAcceleration();
                optimizeAnimations();
                monitorPerformance();
            });
        } else {
            initializeLazyLoading();
            optimizeScrolling();
            optimizeFontLoading();
            enableGPUAcceleration();
            optimizeAnimations();
            monitorPerformance();
        }
    }

    // Run initialization
    init();

    // Report performance metrics
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const metrics = {
                    'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                    'TCP Connection': perfData.connectEnd - perfData.connectStart,
                    'Time to First Byte': perfData.responseStart - perfData.requestStart,
                    'Download Time': perfData.responseEnd - perfData.responseStart,
                    'DOM Processing': perfData.domComplete - perfData.domLoading,
                    'Total Page Load': perfData.loadEventEnd - perfData.navigationStart
                };
                console.log('Performance Metrics:', metrics);
            }
        }, 0);
    });
})();
