import variables from "./variables.js";

class price {
  static #arrayProducts;

  static #maximum = {
    container: document.getElementById("maximum"),
    title: document.getElementById("maximum").querySelector("span"),
    input: document
      .getElementById("maximum")
      .querySelector("input[type=range]"),
    price: undefined,
  };

  static #minimum = {
    container: document.getElementById("minimum"),
    title: document.getElementById("minimum").querySelector("span"),
    input: document
      .getElementById("minimum")
      .querySelector("input[type=range]"),
    price: undefined,
  };

  static #definePrices() {
    price.#maximum.price = undefined;
    price.#minimum.price = undefined;
    price.#arrayProducts.forEach((product) => {
      const value = parseFloat(product.info.price);
      if (!price.#maximum.price || value > price.#maximum.price) {
        price.#maximum.price = value;
      }
      if (!price.#minimum.price || value < price.#minimum.price) {
        price.#minimum.price = value;
      }
    });
    if (!price.#maximum.price) {
      price.#maximum.price = 0;
    }
    if (!price.#minimum.price) {
      price.#minimum.price = 0;
    }
  }

  static #defineValues() {
    price.#minimum.input.setAttribute("min", price.#minimum.price);
    price.#minimum.input.setAttribute("max", price.#maximum.price);
    price.#minimum.title.setAttribute("value", price.#minimum.price);
    price.#minimum.input.value = price.#minimum.price;
    price.#maximum.input.setAttribute("min", price.#minimum.price);
    price.#maximum.input.setAttribute("max", price.#maximum.price);
    price.#maximum.title.setAttribute("value", price.#maximum.price);
    price.#maximum.input.value = price.#maximum.price;
  }

  static #changeValues(range, value = range.input.value) {
    range.input.value = parseInt(value);
    range.title.setAttribute("value", value);
  }

  static #listenerChange(firstRange, secondRange) {
    firstRange.input.addEventListener("change", () => {
      price.#changeValues(firstRange);
      if (
        parseInt(price.#minimum.input.value) >
        parseInt(price.#maximum.input.value)
      )
        price.#changeValues(secondRange, firstRange.input.value);
    });
  }

  static #defineRanges() {
    price.#listenerChange(price.#maximum, price.#minimum);
    price.#listenerChange(price.#minimum, price.#maximum);
  }

  static load(products) {
    price.#arrayProducts = products;
    price.#definePrices();
    price.#defineValues();
  }

  static init() {
    price.load(variables.db);
    price.#defineRanges();
  }
}

export default price;
