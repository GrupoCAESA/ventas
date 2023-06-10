import connection from "../../../../modules/connection/connection.js";

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
    container.appendChild(sections.#createOption("all", "-- Todos --"));
    array.forEach((item) => {
      const key = connection.variables.filters?.[property]?.[item];
      if (item !== "all") {
        container.appendChild(sections.#createOption(item, key ? key : item));
      }
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

  static #categoryAll() {
    document.querySelector(
      '[data-filters-container-section="category"]>select'
    ).innerHTML = `
      <option value="all">-- Todos --</option>
      <option value="miscellaneous">Misceláneos</option>
      <option value="cranes">Grúas</option>
      <option value="transport">Transporte</option>
      <option value="heavy_machinery">Maquinaria Pesada</option>
      <option value="lifting_equipment">Equipos de elevación</option>
      <option value="maritime_equipment">Equipo Maritimo</option>
      <option value="metal_structures">Estructura Metálica</option>
      <option value="injection_and_blowing">Inyección y Soplado</option>
      <option value="industrial_processes">Procesos Industriales</option>
      <option value="mechanical_metal">Metal Mecánica</option>
      <option value="marine_platforms">Plataformas Marinas</option>
      <option value="hydraulic_systems">Sistemas Hidráulicos</option>
      <option value="drilling">Perforación</option>
      <option value="minerals">Minerales</option>
      <option value="scrap_and_recycling">Chatarra y Reciclaje</option>
      <option value="real_estate">Inmobiliaria</option>
      <option value="general_miscellaneous">Misceláneos General</option>
    `;
  }

  static init() {
    sections.load(connection.variables.db);
    // sections.#loadFilter("category");
    sections.#categoryAll();
  }
}

export default sections;
