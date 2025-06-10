// Initialize Locomotive Scroll with GSAP ScrollTrigger integration
function loco() {
    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Create new Locomotive Scroll instance for smooth scrolling
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("main"),
        smartphone: {
            smooth: false
            
        },
        
            tablet: {
            smooth: false
            
        }
    });

    // Update ScrollTrigger on scroll events
    locoScroll.on("scroll", ScrollTrigger.update);

    // Configure ScrollTrigger to work with Locomotive Scroll
    ScrollTrigger.scrollerProxy("main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("main").style.transform ? "transform" : "fixed"
    });

    // Update Locomotive Scroll when ScrollTrigger refreshes
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

// Initialize smooth scrolling
loco();

// Set up canvas and context for image animation
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Frame tracking object for animation
const frame = {
    currentIndex: 0,
    maxIndex: 250
};

// Track loaded images and store image objects
let imageLoaded = 0;
const images = [];

// Preload all animation frames
function preLoadframe() {
    for (let i = 1; i <= frame.maxIndex; i++) {
        const imageUrl = `./assets/images/frame_${i.toString().padStart(4, "0")}.jpg`;
        const img = new Image();
        img.src = imageUrl;
        console.log("Image loaded successfully", img.width, img.height);
        img.onload = () => {
            imageLoaded++;
            if (imageLoaded === frame.maxIndex) {
                loadImage(frame.currentIndex);
                startAnimation();
            }
        };
        images.push(img);
    }
}

// Load and display a specific frame
function loadImage(index) {
    if (index >= 0 && index <= frame.maxIndex) {
       

        const img = images[index];
        const imgWidth = img.width;
        const imgHeight = img.height;
        // Set canvas dimensions to window size
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        // Calculate scaling to maintain aspect ratio
        const scaleX = canvas.width / imgWidth;
        const scaleY = canvas.height / imgHeight;
        const scale = Math.max(scaleX, scaleY);
        console.log("Scale", scale);

        // Calculate new dimensions and centering offsets
        const newWidth = imgWidth * scale;
        const newHeight = imgHeight * scale;
        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        // Clear canvas and draw image
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, newWidth, newHeight);
        
        frame.currentIndex = index;
    }
}

// Handle window resize
window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    loadImage(Math.floor(frame.currentIndex));
});

// Initialize scroll-based animations
function startAnimation() {
    // Animate frame sequence based on scroll position
    gsap.to(frame, {
        currentIndex: frame.maxIndex,
        scrollTrigger: {
            scrub: 0.15,
            trigger: "#hero-section>canvas",
            scroller: "main",
            start: "top top",
            // endTrigger: "#how-it-works",
            end: "100% top",
            pin: true,
            onLeave : function(){
                loadImage(frame.maxIndex);
            }
        },
        onUpdate: function() {
            loadImage(Math.floor(frame.currentIndex));
        }
    });

    gsap.to("#how-it-works", {
        scrollTrigger: {
            trigger: "#how-it-works",
            scroller: "main",
            start: "top top",
        }
    })
}


function heroAnimation(){
    gsap.from("#hero-section .hero-section-content h1" , {
        scrollTrigger: {
            trigger: "#hero-section",
            scroller: "main",
            start: "top top",
            scrub : .15,
        },
        y: 25,
        duration: .3,
    })
    gsap.from("#hero-section .hero-section-content p" , {
        scrollTrigger: {
            trigger: "#hero-section",
            scroller: "main",
            start: "top top",
            scrub : .15,
        },
        y: -25,
        duration: .3,
    })
    gsap.from("#hero-section .hero-section-content .take-now-button" , {
        scrollTrigger: {
            trigger: "#hero-section",
            scroller: "main",
            start: "top top",
            end: "bottom 90%",
            scrub : .15,
        },
        x:100,
        duration: .5,
    })
}

function howItWorksAnimation(){
    
    gsap.from("#how-it-works .step h3" , {
        scrollTrigger: {
            trigger: "#how-it-works",
            scroller: "main",
            start: "top 95%",
            end: "top 45%",
            scrub: .15,
        },
        x: 100,
        stagger: 1,
        duration: 2,
    })
    gsap.from("#how-it-works .step p" , {
        scrollTrigger: {
            trigger: "#how-it-works",
            scroller: "main",
            start: "top 70%",
            end: "top 45%",
            scrub: .15,
        },
        y: 100,
        stagger: 1,
        duration: 2,
    })
}

function quizOptionAnimation(){
    gsap.from("#quiz-option .quiz-option-card" , {
        scrollTrigger: {
            trigger: "#quiz-option",
            scroller: "main",
            start: "top 80%",
            end: "top 20%",
            scrub: .15,
        },
        y: 100,
        opacity: 0,
        stagger: .5,
        duration: 2,
    })
}

function quizSectionAnimation(){

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#quiz-section",
            scroller: "main",
            start: "top 80%",
            end: "top 20%",
            markers: true,
        }
    });
    tl.from("#quiz-section .quiz-section-header h4" , {
        y:-100,
        opacity: 0,
        stagger: .3,
        duration: .5,
    })
    tl.from("#quiz-section .skip-next-button button" , {
        y:100,
        opacity: 0,
        stagger: .2,
        duration: .5,
    })
}

function resultSectionAnimation(){
    gsap.from("#result .result-card", {
        scrollTrigger: {
            trigger: "#result",
            scroller: "main",
            start: "top 80%",
            end: "top 20%",
            scrub: .15,
            markers: true,
        },
        y: 100,
        opacity: 0,
        stagger: .5,
        duration: 2,
    })
}

preLoadframe();
heroAnimation();
howItWorksAnimation();
quizOptionAnimation();
quizSectionAnimation(); 
resultSectionAnimation();
