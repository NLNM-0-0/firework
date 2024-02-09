const maxFireworks = 10;
const minFireworks = 10;
const minHeight = 40;
const maxHeight = 80;
const minX = 10;
const maxX = 90;
const fireworkDuration = 4000;
const fireworkGoToLocationDuration = 1000;
const distanceFromCenterSparkCanGoBeforeDisappear = 120;
const minWidthCenter = 40;
const maxWidthCenter = 80;

const sparkSizePx = 4;
const amountSpark = 36;
const fireworkSparkDuration = fireworkDuration - fireworkGoToLocationDuration;
const fallDist = 50;
const numberTrail = 3;
const minDurationGenerateFirework = fireworkDuration / maxFireworks;
const maxDurationGenerateFirework = fireworkDuration / minFireworks;
const minDistanceFromCenterSparkCanGoBeforeDisappear =
  (1 / 3) * distanceFromCenterSparkCanGoBeforeDisappear;

const SvgFileNames = {
  CatPumpkin: "./svg/cat-pumpkin.svg",
  CatShit: "./svg/cat-shit.svg",
  Fire: "./svg/fire.svg",
  Heart: "./svg/heart.svg",
  Star: "./svg/star.svg",
};

function getRandomSvg() {
  const svgFileNameKeys = Object.keys(SvgFileNames);
  const randomKey =
    svgFileNameKeys[Math.floor(Math.random() * svgFileNameKeys.length)];
  return SvgFileNames[randomKey];
}

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

function replaceKeyValue(data, key, value) {
  const regex = new RegExp(`\\b${key}="[^"]*"`);
  const newData = data.replace(regex, `${key}="${value}"`);

  return newData;
}

function createAndAnimateCenter(container, x, y, color, svgPath, width) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("fill", color);
  svg.setAttribute("width", window.innerWidth);
  svg.setAttribute("height", window.innerHeight);
  svg.setAttribute("x", x - width);
  svg.setAttribute("y", y - width);
  svg.setAttribute("version", 1.0);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  fetch(svgPath)
    .then((response) => response.text())
    .then((svgData) => {
      svgData = svgData.replace(
        "<svg",
        `<svg x="${svg.getAttribute("x")}" y="${svg.getAttribute("y")}"`
      );
      svgData = replaceKeyValue(svgData, "height", width * 2);
      svgData = replaceKeyValue(svgData, "width", width * 2);

      svg.innerHTML = svgData;
      svg.style.position = "fixed";

      container.appendChild(svg);

      path = svg.querySelector("path");
      var keyframes = [
        {
          opacity: 0.5,
        },
        {
          opacity: 0,
        },
      ];

      var animation = path.animate(keyframes, {
        duration: fireworkSparkDuration / 3,
        iterations: 1,
        easing: "ease-out",
      });

      animation.onfinish = function () {
        svg.remove();
      };
    });
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
      offset: 0,
    },
    {
      transform:
        "translate(" +
        Math.cos(angle) * width +
        "px, " +
        Math.sin(angle) * width +
        "px)",
      opacity: 0.8 * opacity,
      offset: 0.4,
    },
    {
      transform:
        "translate(" +
        (Math.cos(angle) * width * 4) / 3 +
        "px, " +
        ((Math.sin(angle) * width * 4) / 3 + fallDist) +
        "px)",
      opacity: 0.3 * opacity,
      offset: 1,
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
    left = getBetweenRandom(minX, maxX)
    firework.style.left = left + "vw";
    firework.style.top = "100vh";

    const randomHeight = getBetweenRandom(minHeight, maxHeight);

    var keyframes = [
      { transform: `translateY(0)` },
      { transform: `translateY(-${randomHeight}vh) scaleY(0.1) scale(0.5)` },
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

      createAndAnimateCenter(
        container,
        x,
        y,
        fireworkColor,
        getRandomSvg(),
        getBetweenRandom(minWidthCenter, maxWidthCenter) / 2
      );

      for (let i = 0; i < amountSpark; i++) {
        var randomAngle = getBetweenRandom(-singleAngle, singleAngle);
        angle = singleAngle * i + randomAngle;

        var width = getBetweenRandom(
          minDistanceFromCenterSparkCanGoBeforeDisappear,
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
});
