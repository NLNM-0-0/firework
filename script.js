const maxFireworks = 10;
const minFireworks = 10;
const minHeight = 40;
const maxHeight = 80;
const minX = 10;
const maxX = 90;
const fireworkDuration = 4000;
const fireworkGoToLocationDuration = 1000;
const distanceFromCenterSparkCanGoBeforeDisappear = 80;

const sparkSizePx = 4;
const amountSpark = 18;
const fireworkSparkDuration = fireworkDuration - fireworkGoToLocationDuration;
const fallDist = 30;
const numberTrail = 6;
const minDurationGenerateFirework = fireworkDuration / maxFireworks;
const maxDurationGenerateFirework = fireworkDuration / minFireworks;

function getBetweenRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function createAndAnimateParentSpark(container, x, y, angle, width, color) {
  for (let i = 1; i <= numberTrail; i++) {
    setTimeout(() => {
      createAndAnimateSpark(
        container,
        x,
        y,
        angle,
        width,
        color,
        (1 / numberTrail) * (numberTrail - i)
      );
    }, 150 * (i - 1));
  }
}

function createAndAnimateSpark(container, x, y, angle, width, color, opacity) {
  var spark = document.createElement("div");
  spark.classList.add("circle");
  spark.style.backgroundColor = color;
  container.appendChild(spark);

  spark.style.left = x - sparkSizePx / 2 + "px";
  spark.style.top = y - sparkSizePx / 2 + "px";

  var keyframes = [
    {
      transform: "translate(0, 0)",
      opacity: 1 * opacity,
    },
    {
      transform:
        "translate(" +
        Math.cos(angle) * width +
        "px, " +
        Math.sin(angle) * width +
        "px)",
      opacity: 0.8 * opacity,
    },
    {
      transform:
        "translate(" +
        (Math.cos(angle) * width * 4) / 3 +
        "px, " +
        ((Math.sin(angle) * width * 4) / 3 + fallDist) +
        "px)",
      opacity: 0.3 * opacity,
    },
  ];

  var animation = spark.animate(keyframes, {
    duration: fireworkSparkDuration,
    iterations: 1,
    easing: "ease-out",
  });

  animation.onfinish = function () {
    spark.remove();
  };
}

function vhToPx(valueInVH) {
  return (
    Math.round(window.innerHeight) -
    Math.round(window.innerHeight / (100 / valueInVH))
  );
}

function handleVisibilityChange() {
  if (document.hidden) {
    clearInterval(animationInterval);
  } else {
    animationInterval = setInterval(
      createFirework,
      getBetweenRandom(maxDurationGenerateFirework, minDurationGenerateFirework)
    );
  }
}

function getRandomColor() {
  var minBrightness = 10; // Adjust the minimum brightness as needed
  var maxBrightness = 20;

  var randomColor =
    "#" +
    Math.floor(
      Math.random() * (maxBrightness - minBrightness + 1) + minBrightness
    ).toString(16) +
    Math.floor(
      Math.random() * (maxBrightness - minBrightness + 1) + minBrightness
    ).toString(16) +
    Math.floor(
      Math.random() * (maxBrightness - minBrightness + 1) + minBrightness
    ).toString(16);

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
      { transform: `translateY(0)`},
      { transform: `translateY(-${randomHeight}vh) scaleY(0.1) scale(0.5)`},
    ];

    var animation = firework.animate(keyframes, {
      duration: fireworkGoToLocationDuration,
      iterations: 1,
      easing: "ease-out",
    });

    container.appendChild(firework);

    animation.onfinish = function () {
      var fireworkRect = firework.getBoundingClientRect();
      var x = fireworkRect.left + fireworkRect.width / 2;
      var y = vhToPx(randomHeight) + fireworkRect.height / 2;

      var fireworkColor = getComputedStyle(firework).backgroundColor;

      var singleAngle = (2 * Math.PI) / amountSpark;

      for (let i = 0; i < amountSpark; i++) {
        var randomAngle = getBetweenRandom(-singleAngle, singleAngle);
        angle = singleAngle * i + randomAngle;

        var width = getBetweenRandom(
          (1 / 3) * distanceFromCenterSparkCanGoBeforeDisappear,
          distanceFromCenterSparkCanGoBeforeDisappear
        );
        createAndAnimateParentSpark(
          container,
          x,
          y,
          angle,
          width,
          fireworkColor
        );
      }
      container.removeChild(firework);
    };
  }

  setInterval(
    createFirework,
    getBetweenRandom(maxDurationGenerateFirework, minDurationGenerateFirework)
  );
  document.addEventListener("visibilitychange", handleVisibilityChange);
});
