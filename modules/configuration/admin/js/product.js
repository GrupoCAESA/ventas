import connection from "../../../connection/connection.js";
import information from "./information.js";

class product {
  static #array;

  static get array() {
    return product.#array;
  }

  static setArray(array) {
    if (array.length > 0 || Boolean(array) || typeof array === "object") {
      product.#array = array;
    }
  }

  static #delete(item) {
    product.#array.splice(product.#array.indexOf(item), 1);
    /* Código para envío a traves de la API de GitHub */
    product.init();
  }

  static #dom(item) {
    const img = document.createElement("img");
    const id = document.createElement("span");
    const name = document.createElement("span");
    const info = document.createElement("div");
    const containerButtons = document.createElement("div");
    const edit = document.createElement("button");
    const del = document.createElement("button");
    const container = document.createElement("li");
    img.alt = `${item.id}`;
    connection.loading.image(img, item.images[0]);
    id.textContent = `${item.id}`;
    name.textContent = `${
      connection.variables.filters.category[item.info.category]
    } ${item.info.model}`;
    info.appendChild(id);
    info.appendChild(name);
    edit.textContent = "Editar";
    edit.addEventListener("click", () => {
      const sectionInfo = document.getElementById("info");
      sectionInfo.classList.add("visible");
      information.init(item);
    });

    del.textContent = "Eliminar";
    del.addEventListener("click", () => {
      product.#delete(item);
    });
    containerButtons.appendChild(edit);
    containerButtons.appendChild(del);
    container.setAttribute("data-products-product", item.id);
    container.appendChild(img);
    container.appendChild(info);
    container.appendChild(containerButtons);
    return container;
  }

  static generate() {}

  static init(array = []) {
    const container = document.getElementById("products");
    if (container.childElementCount > 0) {
      container.innerHTML = "";
    }
    if (array.length === 0 || !Boolean(array) || typeof array !== "object") {
      product.#array = connection.variables.db;
    } else if (array !== product.#array) {
      product.#array = array;
    }
    product.#array.forEach((item) => {
      container.appendChild(product.#dom(item));
    });
  }
}

export default product;
