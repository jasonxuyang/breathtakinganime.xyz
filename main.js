// Init container, body, and cursor
const main = document.getElementById('main');
const body = document.body;
const cursorInner = document.getElementById('cursor_inner');
const cursorOuter = document.getElementById('cursor_outer');
const container = document.getElementById('gallery');
const imgs = document.getElementsByClassName('gallery_img')

// Init variables to keep track of mouse position
let posInnerX = 0;
let posInnerY = 0;
let posOuterX = 0;
let posOuterY = 0;
let pointerPosX = posOuterX;
let pointerPosY = posOuterY;
let pointerDownTarget = 0;

// Init variables to keep track of container position
let diffX, diffY;
let sx = 0;
let sy = 0;
let dx = sx;
let dy = sy;

// Init limit variables

function moveToCenter(e) {
    let imgBounding = e.target.getBoundingClientRect();
    let centerPosX = imgBounding.left + (imgBounding.width / 2);
    let centerPosY = imgBounding.top + (imgBounding.height / 2);
    let windowCenterX = window.innerWidth / 2;
    let windowCenterY = window.innerHeight / 2;
    let centerDiffX = windowCenterX - centerPosX;
    let centerDiffY = windowCenterY - centerPosY;
    sx += centerDiffX;
    sy += centerDiffY;
}

// Lazy Loading Settings
const options = {
    root: document.window,
    rootMargin: '0px',
    threshold: 0
}

//Lazy Loading
function callback (entries, observer) {
    // console.log(observer);
    
    entries.forEach(entry => {
        let imgIntersecting = entry.isIntersecting;
        if (imgIntersecting == true) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}

let observer = new IntersectionObserver(callback, options);

var loadCounter = 0;

function loadProgressIncrementer(e){
    loadCounter ++;
    console.log(loadCounter + ' images have loaded.');
    if (loadCounter === imgs.length) {
        console.log('All images have been loaded.')
    }
}

for (let i = 0; i < imgs.length; i++) {
    imgs.item(i).addEventListener('mouseenter', mouseEnter);
    imgs.item(i).addEventListener('mouseleave', mouseLeave);
    imgs.item(i).addEventListener('load', loadProgressIncrementer);
    imgs.item(i).addEventListener('click', moveToCenter);
    observer.observe(imgs.item(i));
}

// Establishing Event Listeners
window.addEventListener('mousemove', findPointerPosition);
window.addEventListener('mousemove', findDifference);
window.addEventListener('mousedown', onPointerDown)
window.addEventListener('mouseup', onPointerUp)

function mouseEnter() {
    cursorOuter.classList.add("cursor_outer_hover");
}

function mouseLeave() {
    cursorOuter.classList.remove("cursor_outer_hover");
}

// Detect if mouse is pressed
function onPointerDown() {
    pointerDownTarget = 1;
    // console.log("down!");
}

// Detect mouse release
function onPointerUp() {
    pointerDownTarget = 0;
    // console.log("up!");
}

// Find position of cursor relative to window
function findPointerPosition(e) {
    let styleFinder = getComputedStyle(cursorOuter);
    let borderWidth = parseInt(styleFinder.borderTopWidth);
    // console.log(cursorOuter.style.);
    posInnerX = e.clientX - (cursorInner.clientWidth / 2);
    posInnerY = e.clientY - (cursorInner.clientHeight / 2);
    posOuterX = e.clientX - ((cursorOuter.clientWidth + (2 * borderWidth)) / 2);
    posOuterY = e.clientY - ((cursorOuter.clientHeight + (2 * borderWidth)) / 2);
    // console.log("Mouse position: " + posX + ", " + posY);
}

// Update position of pointer
function updatePointerPosition() {
    pointerPosX = lerp(pointerPosX, posOuterX, 0.15);
    pointerPosY = lerp(pointerPosY, posOuterY, 0.15);
    pointerPosX = Math.floor(pointerPosX * 100) / 100;
    pointerPosY = Math.floor(pointerPosY * 100) / 100;
    cursorInner.style.transform = `translate(${posInnerX}px, ${posInnerY}px)`;
    cursorOuter.style.transform = `translate(${pointerPosX}px, ${pointerPosY}px)`;
}

// Find position of container
function findDifference(e) {
    e.preventDefault();
    // If mouse is pressed
    if (pointerDownTarget === 1) {
        // console.log(e.movementX + ", " + e.movementY);
        diffX = e.movementX * 3;
        diffY = e.movementY * 3;
        sx += diffX;
        sy += diffY;
        // console.log(sx + ", " + sy);
    }
}

// Update position of container
function updatePosition() {
    dx = lerp(dx, sx, 0.08);
    dy = lerp(dy, sy, 0.08);
    dx = Math.floor(dx * 100) / 100;
    dy = Math.floor(dy * 100) / 100;
    // console.log(dx + ", " + dy);
    main.style.transform = `translate(${dx}px, ${dy}px)`;
}

// Establishing scroll limits
function pastLimits() {
    let imgBounding = container.getBoundingClientRect();
    // If  scroll past left limit
    if (imgBounding.left >= 0) {
        diffX =  -imgBounding.left / 16;
        sx += diffX;
    }
    // If  scroll past right limit
    if (imgBounding.right <= window.innerWidth) {
        diffX = (window.innerWidth - imgBounding.right) / 16;
        sx += diffX;
    }
    // If  scroll past top limit
    if (imgBounding.top >= 0) {
        diffY = -imgBounding.top / 16;
        sy += diffY;
    }
    // If  scroll past bottom limit
    if (imgBounding.bottom <= window.innerHeight) {
        diffY = (window.innerHeight - imgBounding.bottom) / 16;
        sy += diffY;
    }
}

// Translating to Start Position (Middle of Gallery)
function startPosition() {
    let imgBounding = container.getBoundingClientRect();
    diffX = -(imgBounding.width - window.innerWidth) / 2;
    diffY = -(imgBounding.height - window.innerHeight) / 2;
    sx += diffX;
    sy += diffY;
}

// Linear Interpolation method for smooth scrolling
function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

startPosition();

// Animation Loop
window.requestAnimationFrame(render);

function render() {
    // body.style.height = main.clientHeight + 'px';
    // Function here that checks position of 
    updatePosition();
    updatePointerPosition();
    pastLimits();
    // And we loop again.
    window.requestAnimationFrame(render);
}