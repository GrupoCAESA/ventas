import lottie from "../animation/js/lottie.js";

const itemsDom = {
  html: document.querySelector("html"),
  menu: document.querySelector("#menu"),
  toggler: document.querySelector('#menu-toggler>input[type="checkbox"]'),
  appearance: document.querySelector('[data-menu-list-item="appearance"]'),
};

function appearance() {
  if (!localStorage.getItem("appearance")) {
    localStorage.setItem("appearance", "light");
  }

  itemsDom.html.setAttribute("data-style", localStorage.getItem("appearance"));

  itemsDom.appearance.addEventListener("click", () => {
    localStorage.setItem(
      "appearance",
      itemsDom.html.dataset.style === "light" ? "dark" : "light"
    );

    itemsDom.html.setAttribute(
      "data-style",
      localStorage.getItem("appearance")
    );
  });
}

function toggler() {
  itemsDom.toggler.addEventListener("click", () => {
    itemsDom.menu.classList.toggle("checked");
  });

  window.addEventListener("click", (event) => {
    if (event.target.closest("#menu") !== itemsDom.menu) {
      itemsDom.menu.classList.remove("checked");
    }
  });

  itemsDom.appearance.addEventListener("click", () => {
    itemsDom.menu.classList.remove("checked");
  });
}

function menu() {
  toggler();
  appearance();
  lottie("/modules/menu/json/icons.json");
}

export default menu;
