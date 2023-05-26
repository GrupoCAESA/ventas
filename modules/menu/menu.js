import animation from "../animation/animation.js";

class menu {
  static #appearance() {
    const html = document.querySelector("html");
    const appearance = document.querySelector(
      '[data-menu-list-item="appearance"]'
    );
    if (!localStorage.getItem("appearance")) {
      localStorage.setItem("appearance", "light");
    }

    html.setAttribute("data-style", localStorage.getItem("appearance"));

    appearance.addEventListener("click", () => {
      localStorage.setItem(
        "appearance",
        html.dataset.style === "light" ? "dark" : "light"
      );

      html.setAttribute("data-style", localStorage.getItem("appearance"));
    });
  }

  static #toggler() {
    const containerMenu = document.getElementById("menu");
    const toggler = document
      .getElementById("menu-toggler")
      .querySelector('input[type="checkbox"]');
    const appearance = document.querySelector(
      '[data-menu-list-item="appearance"]'
    );
    toggler.addEventListener("click", () => {
      containerMenu.classList.toggle("checked");
    });

    window.addEventListener("click", (event) => {
      if (event.target.closest("#menu") !== containerMenu) {
        containerMenu.classList.remove("checked");
      }
    });

    appearance.addEventListener("click", () => {
      containerMenu.classList.remove("checked");
    });
  }

  static init() {
    menu.#toggler();
    menu.#appearance();
    animation.lottie.generate("/modules/menu/json/lottie-icons.json");
  }
}

export default menu;
