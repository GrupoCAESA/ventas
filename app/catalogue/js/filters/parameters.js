import connection from "../../../../modules/connection/connection.js";
import price from "../price.js";
import product from "../product.js";
import sections from "./sections.js";

class parameters {
  static #arrayGeneral;

  static #arraysFilters = {
    category: [],
    type: [],
    model: [],
    province: [],
    status: [],
    price: [],
  };

  static #updateParamsUrl(parameter, value) {
    if (parameter) {
      const url = new URL(window.location.href);
      const urlParams = new URLSearchParams(url.search);
      if (value === "all") {
        urlParams.delete(parameter);
      } else {
        urlParams.set(parameter, value);
      }
      url.search = urlParams.toString();
      window.history.replaceState(null, "", url.toString());
    }
  }

  static #deleteAllParamsUrl() {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const selects = document.querySelectorAll(
      "[data-filters-container-section]>select"
    );
    selects.forEach((select) => {
      const property = select.closest("[data-filters-container-section]")
        .dataset.filtersContainerSection;
      urlParams.delete(property);
    });
    urlParams.delete("search");
    urlParams.delete("undefined");
    url.search = urlParams.toString();
    window.history.replaceState(null, "", url.toString());
  }

  static #resetArrays() {
    for (const key in parameters.#arraysFilters) {
      if (parameters.#arraysFilters[key] !== connection.variables.db) {
        parameters.#arraysFilters[key] = connection.variables.db;
      }
    }
  }

  static #reduceArrayFilters() {
    const selects = document.querySelectorAll(
      "[data-filters-container-section]>select"
    );
    selects.forEach((select) => {
      if (select.value !== "all") {
        const property = select.closest("[data-filters-container-section]")
          .dataset.filtersContainerSection;
        parameters.#arraysFilters[property] = parameters.#arraysFilters?.[
          property
        ].filter((item) => item.info[property] === select.value);
        parameters.#updateParamsUrl(property, select.value);
      }
    });
  }

  static #reduceArrayGeneral() {
    parameters.#arrayGeneral = Object.values(parameters.#arraysFilters).reduce(
      (x, y) => {
        return x.concat(
          y.filter(
            (item) =>
              !x.includes(item) &&
              Object.values(parameters.#arraysFilters).every((z) =>
                z.includes(item)
              )
          )
        );
      },
      []
    );
  }

  static #refresh() {
    const search = document.getElementById("result_search");
    if (search.style.display !== "none") {
      search.style.display = "none";
    }
    price.load(parameters.#arrayGeneral);
    product.load(parameters.#arrayGeneral);
  }

  static #reload() {
    parameters.#resetArrays();
    parameters.#deleteAllParamsUrl();
    parameters.#reduceArrayFilters();
    parameters.#reduceArrayGeneral();
  }

  static #changeSelects() {
    const selects = document.querySelectorAll(
      "[data-filters-container-section]>select"
    );
    const type = document.querySelector(
      '[data-filters-container-section="type"]'
    );
    const model = document.querySelector(
      '[data-filters-container-section="model"]'
    );
    selects.forEach((select) => {
      const property = select.closest("[data-filters-container-section]")
        .dataset.filtersContainerSection;
      switch (property) {
        case "category":
          select.addEventListener("change", () => {
            type.style.display = select.value !== "all" ? "flex" : "none";
            model.style.display = select.value !== "all" ? "flex" : "none";
            selects.forEach((select) => {
              const data = select.closest("[data-filters-container-section]")
                .dataset.filtersContainerSection;
              if (data !== "category") {
                select.value = "all";
              }
            });
            parameters.#reload();
            sections.load(parameters.#arrayGeneral);
            parameters.#refresh();
          });
          break;
        case "type":
          select.addEventListener("change", () => {
            selects.forEach((select) => {
              const data = select.closest("[data-filters-container-section]")
                .dataset.filtersContainerSection;
              if (data !== "category" && data !== "type") {
                select.value = "all";
              }
            });
            parameters.#reload();
            sections.partialLoad(parameters.#arrayGeneral);
            parameters.#refresh();
          });
          break;
        default:
          select.addEventListener("change", () => {
            parameters.#reload();
            parameters.#refresh();
          });
          break;
      }
    });
  }

  static #reduceArrayPrices() {
    const minimum = document
      .getElementById("minimum")
      .querySelector("input[type=range]");
    const maximum = document
      .getElementById("maximum")
      .querySelector("input[type=range]");
    parameters.#arraysFilters.price = parameters.#arraysFilters.price.filter(
      (item) =>
        parseInt(item.info.price) >= parseInt(minimum.value) &&
        parseInt(maximum.value) >= parseInt(item.info.price)
    );
  }

  static #reducePrice() {
    parameters.#resetArrays();
    parameters.#updateParamsUrl();
    parameters.#reduceArrayFilters();
    parameters.#reduceArrayPrices();
    parameters.#reduceArrayGeneral();
    product.load(parameters.#arrayGeneral);
  }

  static #changePrice() {
    const minimum = document
      .getElementById("minimum")
      .querySelector("input[type=range]");
    const maximum = document
      .getElementById("maximum")
      .querySelector("input[type=range]");
    minimum.addEventListener("change", () => {
      parameters.#reducePrice();
    });
    maximum.addEventListener("change", () => {
      parameters.#reducePrice();
    });
  }

  static #change() {
    parameters.#resetArrays();
    parameters.#arrayGeneral = connection.variables.db;
    parameters.#changeSelects();
    parameters.#changePrice();
  }

  static #replaceAccents(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  static #searchToFilter(property, value) {
    for (const key in connection.variables.filters?.[property]) {
      if (key === value) {
        return connection.variables.filters[property][key];
      }
    }
  }

  static #loadSearch() {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const param = JSON.parse(urlParams.get("search"));
    const searchParam = parameters.#replaceAccents(param);
    const info = connection.variables.db.filter(
      (item) =>
        item.id == JSON.parse(urlParams.get("search")) ||
        parameters
          .#replaceAccents(
            parameters.#searchToFilter("category", item.info.category)
          )
          .includes(searchParam) ||
        parameters.#replaceAccents(item.info.type).includes(searchParam) ||
        parameters.#replaceAccents(item.info.model).includes(searchParam) ||
        parameters
          .#replaceAccents(
            parameters.#searchToFilter("province", item.info.province)
          )
          .includes(searchParam) ||
        parameters
          .#replaceAccents(
            parameters.#searchToFilter("status", item.info.status)
          )
          .includes(searchParam) ||
        parameters.#replaceAccents(item.info.price).includes(searchParam)
    );
    const specs = [];
    connection.variables.db.forEach((item) => {
      for (const key in item.specs) {
        if (item.specs[key].toLowerCase().includes(searchParam)) {
          specs.push(item);
        }
      }
    });
    parameters.#arrayGeneral = [...new Set(info.concat(specs))];
    parameters.#refresh();
    const search = document.getElementById("result_search");
    const h2 = search.querySelector("h2");
    h2.textContent = `Resultados de la búsqueda: "${searchParam}"`;
    search.style.display = "block";
  }

  static #loadUrlParams() {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const selects = document.querySelectorAll(
      "[data-filters-container-section]>select"
    );
    selects.forEach((select) => {
      const property = select.closest("[data-filters-container-section]")
        .dataset.filtersContainerSection;
      if (urlParams.has(property)) {
        select.value = urlParams.get(property);
        select.dispatchEvent(new Event("change"));
      }
    });
    if (urlParams.has("search")) {
      parameters.#loadSearch();
    }
  }

  static init() {
    parameters.#change();
    parameters.#loadUrlParams();
  }
}

export default parameters;
