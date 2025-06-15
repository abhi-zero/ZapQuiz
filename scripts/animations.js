

// Initialize Locomotive Scroll with GSAP ScrollTrigger integration
let locoScroll;




function loco() {
    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Create new Locomotive Scroll instance for smooth scrolling
    locoScroll = new LocomotiveScroll({
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


// Initialize scroll-based animations

function heroAnimation(){
    gsap.from("#hero-section .hero-section-content h1" , {
        scrollTrigger: {
            trigger: "#hero-section",
            scroller: "main",
            start: "top top",
            scrub : .15,
        },
        duration: .3,
    })
    gsap.from("#hero-section .hero-section-content p" , {
        scrollTrigger: {
            trigger: "#hero-section",
            scroller: "main",
            start: "top top",
            scrub : .15,
        },
        y: -15,
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
        x:50,
        duration: .3,
    })
}

function howItWorksAnimation(){
    gsap.from("#how-it-works .step h3" , {
        scrollTrigger: {
            trigger: "#how-it-works",
            scroller: "main",
            start: "top 90%",
            end: "top 45%",
        },
        x: -500,
        stagger: 1,
        duration: 2,
    })
    gsap.from("#how-it-works .step p" , {
        scrollTrigger: {
            trigger: "#how-it-works",
            scroller: "main",
            start: "top 70%",
            end: "top 45%",
        },
        y: 100,
        opacity: 0,
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
            end: "top 30%",
            scrub: .15,
        },
        y: 100,
        opacity: 0,
        stagger: .5,
        duration: 2,
    })
}

function mobileMenuAnimation(){
   const menuButton = document.querySelector(".logo-part i");
   const closeButton = document.querySelector(".menu i");
    const tl = gsap.timeline();

   tl.to(".menu", {
    left: "0%",
    ease: "power2.inOut",
    duration: 1
   })
   tl.from(".menu ul li a", {
    x: 100,
    opacity: 0,
    stagger: .2,
    duration: .3,
   })
   tl.from(".login-signup", {
    y: -50,
    opacity: 0,
    duration: .3,
   })
   tl.pause();
   menuButton.addEventListener("click", () => {
    tl.play();
   })
   closeButton.addEventListener("click", () => {
    tl.reverse();
   })
    
}
if(window.innerWidth < 850){
    mobileMenuAnimation();
}


export function animateText(){
    gsap.from(".word",{
       y: 100,
       opacity: 0,
       stagger: .2,
       duration: .5,
    })
}

export function scrollToSection(button,section){
    button.addEventListener("click", () => {
        setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
    });

}


heroAnimation();
howItWorksAnimation();
quizOptionAnimation();
quizSectionAnimation(); 
resultSectionAnimation();
