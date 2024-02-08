const maxFireworks = 10;
const minFireworks = 10;
const minHeight = 20;
const maxHeight = 80;
const minX = 10;
const maxX = 90;
const fireworkdDuration = 4000;
const fireworkGoToLocationDuration = 1000;
const distanceFromCenterSparkCanGoBeforeDisappear = 150;

const sparkSizePx = 4;
const amountSpark = 36;
const fireworkSparkDuration = fireworkdDuration - fireworkGoToLocationDuration;

function getBetweenRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function createAndAnimateSpark(container, x, y, index, color) {
    var spark = document.createElement('div');
    spark.classList.add('circle');
    spark.style.backgroundColor = color;
    container.appendChild(spark);

    var angle = (2 * Math.PI / amountSpark) * index; // Convert degrees to radians

    spark.style.left = x - sparkSizePx / 2 + 'px';
    spark.style.top = y - sparkSizePx / 2 + 'px';

    var keyframes = [
        {
            transform: 'translate(0, 0)',
            opacity: 1
        },
        {
            transform: 'translate(' + Math.cos(angle) * distanceFromCenterSparkCanGoBeforeDisappear + 'px, ' + Math.sin(angle) * distanceFromCenterSparkCanGoBeforeDisappear + 'px)',
            opacity: 0.3
        },
    ];

    var animation = spark.animate(keyframes, {
        duration: fireworkSparkDuration,
        iterations: 1,
        easing: "ease-out"
    });

    animation.onfinish = function () {
        spark.remove();
    };
}

function vhToPx(valueInVH) {
    return Math.round(window.innerHeight) - Math.round(window.innerHeight / (100 / valueInVH));
}

function getRandomColor() {
    var minBrightness = 10; // Adjust the minimum brightness as needed
    var maxBrightness = 20;

    var randomColor = '#' +
        Math.floor(Math.random() * (maxBrightness - minBrightness + 1) + minBrightness).toString(16) +
        Math.floor(Math.random() * (maxBrightness - minBrightness + 1) + minBrightness).toString(16) +
        Math.floor(Math.random() * (maxBrightness - minBrightness + 1) + minBrightness).toString(16);

    return randomColor;
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".fireworks-container");

    function createFirework() {
        const firework = document.createElement("div");
        firework.className = "firework";

        const randomColor = getRandomColor();
        firework.style.backgroundColor = randomColor;
        firework.style.left = getBetweenRandom(minX, maxX) + "vw";
        firework.style.top = "100vh";

        const randomHeight = getBetweenRandom(minHeight, maxHeight);
        var keyframes = [
            { transform: `translateY(0)` },
            { transform: `translateY(-${randomHeight}vh)` }
        ];

        var animation = firework.animate(keyframes, {
            duration: fireworkGoToLocationDuration,
            iterations: 1,
            easing: "ease-out"
        });

        container.appendChild(firework);

        animation.onfinish = function () {
            var fireworkRect = firework.getBoundingClientRect();
            var x = fireworkRect.left + fireworkRect.width / 2;
            var y = vhToPx(randomHeight) + fireworkRect.height / 2;

            var fireworkColor = getComputedStyle(firework).backgroundColor;

            for (let i = 0; i < amountSpark; i++) {
                createAndAnimateSpark(container, x, y, i, fireworkColor);
            }
            container.removeChild(firework);
        };
    }

    // Create fireworks at intervals
    const min = fireworkdDuration / maxFireworks;
    const max = fireworkdDuration / minFireworks;
    if (max < min) {
        max = min
    }
    setInterval(createFirework, getBetweenRandom(max, min));
});
