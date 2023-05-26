import connection from "../connection/connection.js";

class lottie {
  static #movin({
    path,
    container,
    item = container,
    loop = false,
    autoplay = false,
  }) {
    if (item !== container) {
      item = container + item;
    }

    const icon = bodymovin.loadAnimation({
      container: document.querySelector(item),
      path: path,
      render: "svg",
      loop: loop,
      autoplay: autoplay,
    });

    const contain = document.querySelector(container);

    if (!autoplay) {
      contain.addEventListener("mouseenter", () => {
        icon.play();
      });

      contain.addEventListener("mouseleave", () => {
        icon.stop();
      });
    }
  }

  static async generate(url) {
    let ics = await connection.connect.get(url);
    ics.forEach((ic) => {
      lottie.#movin(ic);
    });
  }
}

class mouseWhell {
  static horizontal(item, displacement = 50) {
    item.addEventListener("wheel", (event) => {
      event.preventDefault();
      item.scrollBy({
        left: event.deltaY < 0 ? -displacement : displacement,
      });
    });
  }
}

const animation = Object.freeze({
  lottie,
  mouseWhell,
});

export default animation;
