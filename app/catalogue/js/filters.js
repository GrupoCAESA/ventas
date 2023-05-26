import parameters from "./filters/parameters.js";
import sections from "./filters/sections.js";

class filters {
  static #toggler() {
    const input = document
      .getElementById("filters-toggler")
      .querySelector("input");
    const containerFilters = document.getElementById("filters");
    input.addEventListener("click", () => {
      containerFilters.classList.toggle("checked");
    });
  }
  static init() {
    filters.#toggler();
    sections.init();
    parameters.init();
  }
}

export default filters;
