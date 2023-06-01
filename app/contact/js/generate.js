async function worldMap() {
  fetch("/app/contact/svg/world_map.svg")
    .then((response) => response.text())
    .then((svg) => {
      const container = document.getElementById("world_map");
      container.innerHTML = svg;
    });
}

class construction {
  static #getRandomInt(min, max, str = true) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (str) {
      return String(Math.floor(Math.random() * (max - min)) + min);
    }
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static #buildElements() {
    const sparkElements = document.querySelectorAll(".spark");
    const weldElements = document.querySelectorAll(".weld-container");

    sparkElements.forEach((spark, index) => {
      const sibling = weldElements[index];
      const baseAnimationDelay = construction.#getRandomInt(1, 15);
      const weld = document.createElement("div");
      weld.classList = "weld";
      weld.style.animationDelay = String(baseAnimationDelay) + "s";
      sibling.appendChild(weld);

      for (var i = 0; i <= 25; i++) {
        const sparkDiv = construction.#generateSpark(baseAnimationDelay);
        spark.appendChild(sparkDiv);
      }
    });
  }

  static #generateSpark(delay) {
    const sparkDiv = document.createElement("div");
    sparkDiv.classList = "particle";
    sparkDiv.style.top = construction.#getRandomInt(25, 35) + "px";
    sparkDiv.style.left = construction.#getRandomInt(0, 5) + "px";
    sparkDiv.style.width = construction.#getRandomInt(1, 2) + "px";
    sparkDiv.style.height = construction.#getRandomInt(4, 7) + "px";
    if (construction.#getRandomInt(1, 3) == 2) {
      sparkDiv.classList = sparkDiv.classList + " negative-X";
    } else {
      sparkDiv.classList = sparkDiv.classList + " positive-X";
    }
    let combinedDelay =
      construction.#getRandomInt(0, 9) / 10 + parseFloat(delay);
    sparkDiv.style.animationDelay = String(combinedDelay) + "s";
    return sparkDiv;
  }

  static #startIntervalCounter() {
    setInterval(() => {
      const materialSVG = document.getElementById("material-group");
      materialSVG.classList.toggle("hidden");
    }, 45000);
  }

  static #generate() {
    fetch("/app/contact/txt/construction.txt")
      .then((response) => response.text())
      .then((content) => {
        const container = document.getElementById("background");
        container.innerHTML = content;
      });
  }

  static async init() {
    await construction.#generate();
    construction.#buildElements();
    construction.#startIntervalCounter();
  }
}

const generate = Object.freeze({
  worldMap,
  construction,
});

export default generate;
