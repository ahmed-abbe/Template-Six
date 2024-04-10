// Declare The Header Element
let mainHeader = document.querySelector("header");

// Get The Header Height And Declare ScrollTop Variable (To Use It later) ;
let headerHeight = mainHeader.clientHeight,
    scrollTop;

// Get The Top Header And Bottom Header Elements
let topHeader = mainHeader.firstElementChild;

// Add Evevnt Listener To The Document (Scroll)
document.addEventListener("scroll", () => {
    // Check How Many Pixels Had Been Scrolled
    scrollTop = window.scrollY;

    // Check If The The Scroll Value Ia Already Bigger Than THe Header Height
    if (scrollTop - headerHeight > 0) {
        // Check Is There Inline Style In Header Element Or Not Yet (Better Performance & Memory use)
        if (mainHeader.style.cssText === "") {
            // Add The Next Style To The Header Element
            mainHeader.style.cssText = "position: sticky; top: -100%; left: 0;";
        }

        // Check If The ScrollY Value Is Bigger Than The Header Height By 150px
        if (scrollTop - headerHeight > 150) {
            // Make Sure The Inline Style Doesn't Have The New Value Already
            if (mainHeader.style.top === "-100%") {
                mainHeader.style.top = `-${topHeader.clientHeight}px`;
            }
        }
    } else {
        // Check If Header Has Inline Style Already
        if (mainHeader.style.cssText !== "") {
            // Remove The Inline Style
            mainHeader.style.cssText = "";
        }
    }
});

// Declare The Bars Icons
let mobileBars = document.querySelector("header .bottom-header .mobile-bars");

// Add Event Listener To The Bars Icon (Click);
mobileBars.addEventListener("click", (e) => {
    // Stop Propagation On Click
    e.stopPropagation();

    // Toggle Class Active
    mobileBars.classList.toggle("active");
});

// Declare li Dropdown Elements
let spans = document.querySelectorAll(
    "header .bottom-header nav > ul > .dropdown"
);

// Loop Through Every Li
spans.forEach((span) => {
    // Declare li inside dropdown Element
    let li = span.querySelector("li");

    // Add Event Listener to li (Click)
    span.addEventListener("click", () => {
        // Toggle Class Active
        li.classList.toggle("active");
    });
});

// Declare All Elmements For slide Effect
let wrapper = document.querySelector(".slider .wrapper"),
    slide = document.querySelector(".slider .wrapper .images"),
    prevBtn = document.querySelector(".slider .prev-btn"),
    nextBtn = document.querySelector(".slider .next-btn");

slideShift(wrapper, slide, prevBtn, nextBtn);

// Get Section & All Nums Elements
let rateSection = document.querySelector(".rates"),
    rateNums = document.querySelectorAll(".rates .rate-box .num");

// Create Started Variable To check Weather The Action Started Or Not
let started = false;

// Add Scroll Event On Window
window.addEventListener("scroll", () => {
    // Check Weather User Scrooled To The Rate Section
    if (
        window.scrollY >=
        rateSection.offsetTop +
            rateSection.clientHeight / 2 -
            document.documentElement.clientHeight
    ) {
        // Make Sure That The Increasing Number Didn't Start
        if (!started) {
            // Loop Through Every Num Element
            rateNums.forEach((num) => {
                // Get The Value To reach
                let goal = num.dataset.goal;
                let b;
                let a = 0;
                let incre = goal / 100;
                // create animation
                function step(timestamp) {
                    a += incre;
                    num.textContent = Math.min(Math.round(a), goal);
                    b = requestAnimationFrame(step);
                    if (a >= goal) {
                        cancelAnimationFrame(b);
                    }
                }
                requestAnimationFrame(step);
            });
        }
        // Change The Stared Value
        started = true;
    }
});

// Get The Video Section On Services Section
let videoIcon = document.querySelector(".services .video .play-video .icon");

// Add Event Click On The Video Element
videoIcon.addEventListener("click", () => {
    // Create The Background Elements
    let backgroundElement = document.createElement("div"),
        videoElement = document.createElement("div");
    closeButton = document.createElement("button");

    // Add Classes To The Background Elements
    backgroundElement.classList.add("video-background");
    closeButton.classList.add("close-btn");

    // Remove The Unactive Class And The Video Element On The Close Button Click
    closeButton.onclick = () => {
        document.body.classList.remove("unactive");

        backgroundElement.remove();
    };

    // Add Unactive Class To Stop Scrolling
    document.body.classList.add("unactive");

    // Apeend Elmenets To The Background Element
    videoElement.append(closeButton);
    backgroundElement.append(videoElement);

    // Append Background Element After The header Element
    topHeader.parentElement.after(backgroundElement);
});

// Add Scroll Behavior
scrollSlider();

// Start Functions

// Function For Image Change In Slider
function slideShift(wrapper, slider, prev, next) {
    let images = document.querySelectorAll(".slider .wrapper .image"),
        length = images.length,
        imageWidth = images[0].offsetWidth,
        index = 0,
        shift = true,
        posX1,
        posX2,
        thershold = 200,
        posInitial,
        posFinal;

    // Declare Container For All Elements In Slider with its' length
    let container = slider.querySelectorAll(".container");
    let contLength = container.length;

    // Declare Cuurent Element To Check The Current Visible Container
    let current = 0;

    // Get The Buttons Elements In The Wrapper Elmements Before Appending Child
    let buttonElements = wrapper.querySelectorAll(".container .buttons");

    /* 
        append First image To Be Last Element
        And append Last Image To Be First Element 
        To Make The Slider Has Infinite Effect
    */
    slider.append(images[0].cloneNode(true));
    slider.prepend(images[length - 1].cloneNode(true));

    // Add Loaded Class After Finishing
    slider.classList.add("loaded");

    // Add Class Active To Show Text On First Container (cloned containers not included)
    container[current].classList.add("active");

    // Add Event When the mouse if down
    wrapper.addEventListener("mousedown", dragStart);

    // Add Events When User Touch the Screen
    wrapper.addEventListener("touchstart", dragStart);
    wrapper.addEventListener("touchmove", dragAction);
    wrapper.addEventListener("touchend", dragEnd);

    // Change Image Every 10 Seconds Automatically (Can Change Time From The Function)
    let changer = imageAutoChange();

    // On Prev Button Click Change To Image Before The Current Image
    prev.addEventListener("click", () => {
        changeImage(-1);
    });

    // On Next Button Click Change To Image After The Current Image
    next.addEventListener("click", () => {
        changeImage(1);
    });

    function dragStart(e) {
        e.preventDefault();

        // Get The Left Style Value
        posInitial = slider.offsetLeft;

        // check if the event fired on a touch screen or not
        if (e.type === "touchstart") {
            posX1 = e.touches[0].cleintX;
        } else {
            wrapper.style.cursor = "grabbing";
            posX1 = e.clientX;
            wrapper.addEventListener("mousemove", dragAction);
            wrapper.addEventListener("mouseup", dragEnd);
        }

        // To Stop The Auto Changer From Change (Create It Again After Transition)
        clearInterval(changer);
    }

    function dragAction(e) {
        // check if the event fired on a touch screen or not
        if (e.type === "touchmove") {
            posX2 = posX1 - e.touches[0].clientX;
            posX1 = e.touches[0].clientX;
        } else {
            posX2 = posX1 - e.clientX;
            posX1 = e.clientX;
        }
        slider.style.left = `${slider.offsetLeft - posX2}px`;
    }

    function dragEnd(e) {
        // check if the event fired from mouse or not
        if (e.type === "mouseup") {
            wrapper.style.cursor = "default";
        }
        // Get The Current CSS Left Value
        posFinal = slider.offsetLeft;

        if (posFinal - posInitial < -thershold) {
            changeImage(1, "drag");
        } else if (posFinal - posInitial > thershold) {
            changeImage(-1, "drag");
        } else {
            slider.style.left = `${posInitial}px`;
            // The Image Auto Change Will Work Again
            changer = imageAutoChange();
        }
        wrapper.removeEventListener("mousemove", dragAction);
        wrapper.removeEventListener("mouseup", dragEnd);
    }

    function changeImage(dir, action) {
        /*
            Add Class Active To Slider For The Transition Effect 
            And Remove It From Container For The Text Anmation Effect 
        */
        slider.classList.add("active");
        container[current].classList.remove("active");

        if (shift) {
            // If Action Dosen't Exist Then Get The Current Start Position Value
            if (!action) {
                posInitial = slide.offsetLeft;
            }
            if (dir === 1) {
                slider.style.left = `${posInitial - imageWidth}px`;
                index++;
                current++;
            } else if (dir === -1) {
                slider.style.left = `${posInitial + imageWidth}px`;
                index--;
                current--;
            }

            // Check Cuurent Value So It Doesn't Overlap
            if (current === -1) {
                current = contLength - 1;
            } else if (current === contLength) {
                current = 0;
            }

            // To Stop The Auto Changer From Change (Create It Again After Transition)
            clearInterval(changer);
        }

        // Don't Allow Image Change Until The Transition Is Over
        shift = false;
    }

    slider.addEventListener("transitionend", () => {
        slider.classList.remove("active");
        container[current].classList.add("active");
        /*
        Check Index Value
        And Change The Index Value And The slider CSS Left   
        */
        if (index === -1) {
            slider.style.left = `-${length * imageWidth}px`;
            index = length - 1;
        } else if (index === length) {
            slider.style.left = `-${imageWidth}px`;
            index = 0;
        }

        // The Image Auto Change Will Work Again
        changer = imageAutoChange();

        shift = true;
    });

    // Stop Firing Transition end Event Above For Slider Childerns Transition
    container.forEach((ele) => {
        ele.addEventListener("transitionend", (e) => {
            e.stopPropagation();
        });
    });

    /* 
        Stop Firing Touch Start Event When The User CLick On Button
        Note: 
            1- In case You Didn't stop it the user won't be able to click the button on touch screens
            2- The hover effect won't fire
    */
    buttonElements.forEach((ele) => {
        ele.addEventListener("touchstart", (e) => {
            e.stopPropagation();
        });
        ele.addEventListener("touchmove", (e) => {
            e.stopPropagation();
        });
        ele.addEventListener("touchend", (e) => {
            e.stopPropagation();
        });
    });

    // Resize Observer Api Which Will Fire On The Window Size Change
    let resizeObserver = new ResizeObserver(() => {
        // Clear Intervel So It Don't Conflict Values
        clearInterval(changer);

        // Get The Image Number That Is Currently Visible In Slider
        let oldLeft = slider.offsetLeft / imageWidth;

        // Get The New Image Width After Change
        imageWidth = images[0].offsetWidth;

        // Make The Slider Display The Same Image That Was Visible
        slider.style.left = `${oldLeft * imageWidth}px`;

        // Auto Change The Image Again After Finishing
        changer = imageAutoChange();
    });

    // Observe The Body Element Everytime Its' Size Change
    resizeObserver.observe(document.body);

    // Function To Create An Auto Changer For The Current Image
    function imageAutoChange() {
        return setInterval(() => {
            changeImage(1);
        }, 10000);
    }
}

function scrollSlider() {
    // Get The Slide Track Element
    let slideTrack = document.querySelector(".inside-hospital .slide-track");

    // Create Cloned Slides
    let slides = slideTrack.querySelectorAll(".slide");

    let slidesLength = slides.length;

    slides.forEach((slide) => {
        slideTrack.appendChild(slide.cloneNode(true));
    });

    // Get The Slide Width (Slize That Contain The Image)
    let slideWidth = slideTrack.querySelector(".slide").clientWidth;

    // Set The Default Value For Left
    let left = 0;

    // Create Interval To Change Image Every 10 Seconds
    setInterval(() => {
        // Add Class Active Which Add Smooth Effect In Image Changing
        slideTrack.classList.add("active");

        // Add The Slide Width + 25(The Column Gap Size)
        left += slideWidth + 25;

        // Update The Translate X Value
        slideTrack.style.transform = `translateX(-${left}px)`;
    }, 10000);

    // On The Transition End
    slideTrack.addEventListener("transitionend", () => {
        // Will Remove The Active Class List
        slideTrack.classList.remove("active");

        // Check Wether The Slide Has Reached The Last Image Or Not
        if (left >= slideWidth * slidesLength) {
            // If True Then Update The Translate X And Left Value
            slideTrack.style.transform = "none";

            left = 0;
        }
    });

    // Change Slide Width On Screen Size Change
    let resizeObserver = new ResizeObserver(() => {
        // Get The Current Image Position
        left = Math.trunc((left / slideWidth) % slidesLength);

        // Change The Slide Width Value
        slideWidth = slideTrack.querySelector(".slide").clientWidth;

        // Get The Cuurent Left Value With The New Size
        left = slideWidth * left + 25 * left;

        // Update The Translate X Value
        slideTrack.style.transform = `translateX(-${left}px)`;
    });

    resizeObserver.observe(document.body);
}
// End Functions
