import connection from "../../../connection/connection.js";
import information from "./information.js";
import product from "./product.js";

class topBar {
  static #newProduct() {
    const button = document.getElementById("new_product");
    const info = document.getElementById("info");

    button.addEventListener("click", () => {
      info.classList.add("visible");
      information.init();
    });
  }

  static #search() {
    const container = document.getElementById("search");
    const input = container.querySelector("input");
    const button = container.querySelector("i");

    input.addEventListener("input", () => {
      if (input.value.length === 0 || input.value === "") {
        product.init();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    });

    button.addEventListener("click", () => {
      input.value = input.value.replace("<script>", "");
      input.value = input.value.replace("</script>", "");
      input.value = input.value.replace(" ", "");

      const array = connection.variables.db.filter(
        (item) =>
          item.id.toLowerCase().includes(input.value.toLowerCase()) ||
          item.id.toLowerCase() === input.value.toLowerCase()
      );

      product.init(array);
    });
  }

  static init() {
    topBar.#newProduct();
    topBar.#search();
  }
}

export default topBar;
