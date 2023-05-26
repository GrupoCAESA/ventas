import variables from "../variables.js";

class sections {
  static #arrayProducts;

  static #createOption(value, content) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = content;
    return option;
  }

  static #createArray(property) {
    const array = [];
    sections.#arrayProducts.forEach((prod) => {
      const product = prod.info?.[property];
      if (product && !array.includes(product)) {
        array.push(product);
      }
    });
    array.sort();
    return array;
  }

  static #loadFilter(property) {
    const array = sections.#createArray(property);
    const container = document.querySelector(
      `[data-filters-container-section=${property}]>select`
    );
    container.innerHTML = "";
    container.appendChild(sections.#createOption("All", "-- Todos --"));
    array.forEach((item) => {
      const key = variables.filters?.[property]?.[item];
      container.appendChild(sections.#createOption(item, key ? key : item));
    });
  }

  static partialLoad(products) {
    if (sections.#arrayProducts !== products) {
      sections.#arrayProducts = products;
    }
    sections.#loadFilter("model");
    sections.#loadFilter("province");
    sections.#loadFilter("status");
  }

  static load(products) {
    sections.#arrayProducts = products;
    sections.#loadFilter("type");
    sections.partialLoad(sections.#arrayProducts);
  }

  static init() {
    sections.load(variables.db);
    // sections.#loadFilter("category");
  }
}

export default sections;
