const images = ["glacier-8329668_1280.jpg", "people-8386051_1280.webp", "mountains-8357180_1280.webp"];
const background = document.getElementById("background");
let lastRandomIndex;

function randomBackground() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * images.length);
    } while (randomIndex === lastRandomIndex);

    lastRandomIndex = randomIndex;

    const imageUrl = `/assets/images/${images[randomIndex]}`;
    background.style.backgroundImage = `url('${imageUrl}')`;
}

window.onload = () => {
    randomBackground();
}

setInterval(() => {
    randomBackground();
}, 8000);
