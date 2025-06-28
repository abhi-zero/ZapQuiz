
import { quizState } from "./quizApp.js";

const heroSection = document.querySelector("#hero-section");
const progressElement = document.getElementById("progress");

// Set up canvas and context for image animation
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Frame tracking object for animation
const frame = {
    currentIndex: 0,
    maxIndex: 361
};

// Track loaded images and store image objects
let imageLoaded = 0;
const images = [];

function hideLoadingScreen(){
    document.querySelector("body").style.overflow = "hidden";
    if(imageLoaded === frame.maxIndex && quizState.questions.length > 0){
        document.querySelector(".loading-screen-content").style.display = "none";
         document.querySelector("body").style.overflow = "unset";
    }
}

// Handle canvas resize
function setCanvasSize(){
    if(!heroSection){
        return;
    }
    const heroRect = heroSection.getBoundingClientRect();
    canvas.height = heroRect.height;
    canvas.width = heroRect.width;
}

// Preload all animation frames
function preLoadframe() {
    let totalImages = frame.maxIndex;
    for (let i = 1; i <= frame.maxIndex; i++) {
        const imageUrl = `./assets/images/frame_${i.toString().padStart(4, "0")}.jpeg`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            imageLoaded++;
            // Update progress bar width
            const progress = (imageLoaded / totalImages) * 100;
            progressElement.style.width = progress + "%";
            if (imageLoaded === frame.maxIndex) {
                setCanvasSize();
                loadImage(frame.currentIndex);
                startAnimation();
                hideLoadingScreen();
            }
        };
        images.push(img);
    }
}

// Load and display a specific frame
function loadImage(index) {
    if (index >= 0 && index <= frame.maxIndex) {
        const img = images[index];

        if (!img || !img.complete || img.naturalWidth === 0) {
            return;
        }
       
        const imgWidth = img.width;
        const imgHeight = img.height;
        // Set canvas dimensions to window size
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        // Calculate scaling to maintain aspect ratio
        const scaleX = canvas.width / imgWidth;
        const scaleY = canvas.height / imgHeight;
        const scale = Math.max(scaleX, scaleY);

        // Calculate new dimensions and centering offsets
        const newWidth = imgWidth * scale;
        const newHeight = imgHeight * scale;
        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        // Clear canvas and draw image
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        
        frame.currentIndex = index;
    }
}



window.addEventListener("resize", ()=> {
   if(imageLoaded === frame.maxIndex){
    setCanvasSize()
    loadImage(frame.currentIndex)
   }
})

function loadingScreenAnimation(){
    const interval = setInterval(() => {
        // Update progress bar width
        progressElement.style.width = progress + "%";
        if(imageLoaded === frame.maxIndex && quizState.questions.length > 0){
            clearInterval(interval);
            hideLoadingScreen();
        }
    }, 500);
}

function startAnimation() {
    // Animate frame sequence based on scroll position
    gsap.to(frame, {
        currentIndex: frame.maxIndex,
        snap : {currentIndex: 1},
        willChange : 'transform',
        scrollTrigger: {
             scrub : true,
            trigger: "#hero-section canvas",
            scroller: "main",
            start: "top top",
            end: "100% top",
            pin: true,
            // onLeaveBack : function () {
            //     loadImage(0); // Load the first frame
            // },
        },
        onUpdate: function() {
            const currentFrame = Math.max(0, Math.min(Math.round(frame.currentIndex), images.length - 1));
          if(currentFrame >= 0 && currentFrame < images.length){
           loadImage(currentFrame)
          }
        }
    });
}

if(window.innerWidth > 850){
    loadingScreenAnimation();
    preLoadframe();
}else{
    document.querySelector(".loading-screen-content").style.display = "none";
}