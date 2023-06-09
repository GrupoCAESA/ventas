import menu from "../../modules/menu/menu.js";
import animation from "../../modules/animation/animation.js";

class search {
  static #message(title) {
    Swal.fire({
      icon: "warning",
      title: title,
      customClass: {
        popup: "sweetAlert-popup",
        title: "sweetAlert-title",
        icon: "sweetAlert-icon",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }

  static #preventSpaces() {
    const inputSearch = document
      .getElementById("search")
      .querySelector('input[type="text"]');
    inputSearch.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        search.#message("Realiza una palabra por búsqueda.");
      }
    });
  }

  static #enter() {
    const button = document.getElementById("search").querySelector("a");
    const inputSearch = document
      .getElementById("search")
      .querySelector('input[type="text"]');
    inputSearch.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        button.dispatchEvent(new Event("click"));
      }
    });
  }

  static #send() {
    const button = document.getElementById("search").querySelector("a");
    const inputSearch = document
      .getElementById("search")
      .querySelector('input[type="text"]');
    button.addEventListener("click", () => {
      if (inputSearch.value) {
        window.location.href = `/catalogue.html?search="${inputSearch.value}"`;
        inputSearch.value = "";
      } else {
        search.#message("Ingrese un valor.");
      }
    });
  }

  static init() {
    search.#preventSpaces();
    search.#enter();
    search.#send();
  }
}

(() => {
  menu.init();
  search.init();
  animation.lottie.generate("/app/home/json/lottie-icons.json");
  animation.mouseWhell.horizontal(document.getElementById("best_seller-list"));
})();
