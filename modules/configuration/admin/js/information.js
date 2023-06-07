import connection from "../../../connection/connection.js";

class create {
  static id() {
    const key = uuid.v4();
    while (connection.variables.db.some((item) => item.id === key)) {
      key = uuid.v4();
    }
    return key;
  }
  static #input({ type, property }) {
    let input;
    switch (type) {
      case "select":
        const filters = connection.variables.filters?.[property];
        input = document.createElement("select");
        if (Boolean(filters)) {
          const optionAll = document.createElement("option");
          optionAll.value = "all";
          optionAll.textContent = "-- Seleccionar --";
          input.appendChild(optionAll);
          for (const key in filters) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = filters[key];
            input.appendChild(option);
          }
        }
        break;
      case "textarea":
        input = document.createElement("textarea");
        break;
      default:
        input = document.createElement("input");
        input.type = type;
        break;
    }
    return input;
  }

  static label({ type = "", property = "" }) {
    const span = document.createElement("span");
    if (property === "id") {
      span.textContent = "ID:";
    } else {
      span.textContent = `${
        connection.variables.filters.transalte?.[property] || property
      }:`;
    }
    const input = create.#input({ type: type, property: property });
    const label = document.createElement("label");
    label.appendChild(span);
    if (input) {
      input.classList.add("input");
      label.appendChild(input);
    }
    return label;
  }

  static structureImage(item, index) {
    const labelUrl = create.label({ type: "url", property: "URL" });
    if (item && index) {
      labelUrl.querySelector(".input").value = index;
    }
    const span = document.createElement("span");
    span.textContent = "o";
    const labelFile = create.label({ type: "file", property: "Subir" });
    labelFile.setAttribute(
      "accept",
      "image/png, image/jpg, image/jepg, image/webp"
    );
    labelFile.classList.add("file");
    labelFile.querySelector("span").textContent = labelFile
      .querySelector("span")
      .textContent.replace(":", "");
    labelFile.querySelector(".input").addEventListener("change", (event) => {
      console.log(event.target.files[0]);
      /* -------------- Evento de la API de imgbb -------------- */
    });
    const button = document.createElement("button");
    button.textContent = "X";
    button.addEventListener("click", () => {
      if (item && index) {
        item.images.splice(item.images.indexOf(index), 1);
      }
      li.remove();
    });
    const li = document.createElement("li");
    li.appendChild(labelUrl);
    li.appendChild(span);
    li.appendChild(labelFile);
    li.appendChild(button);
    return li;
  }

  static structureSpecs(item, key) {
    const title = create.label({ type: "text", property: "Titulo" });
    if (item && key) {
      title.querySelector(".input").value = key;
    }
    const descr = create.label({ type: "textarea", property: "Descripción" });
    const textarea = descr.querySelector(".input");
    if (item && key) {
      textarea.value = item.specs[key];
    }
    setTimeout(() => {
      textarea.style.height = "2em";
      textarea.style.height = `${textarea.scrollHeight + 0.6}px`;
    }, 10);
    textarea.addEventListener("input", () => {
      setTimeout(() => {
        textarea.style.height = "2em";
        textarea.style.height = `${textarea.scrollHeight + 0.6}px`;
      }, 10);
    });
    const button = document.createElement("button");
    button.textContent = "X";
    button.addEventListener("click", () => {
      if (item && key) {
        delete item.specs[key];
      }
      li.remove();
    });
    const li = document.createElement("li");
    li.appendChild(title);
    li.appendChild(descr);
    li.appendChild(button);
    return li;
  }
}

class information {
  static #info(item) {
    const title = document.createElement("h2");
    title.textContent = "Información";
    const formId = create.label({
      property: "id",
      type: "text",
    });
    formId.id = "info-info-form-id";
    const formIdInput = formId.querySelector(".input");
    formIdInput.disabled = "disabled";
    formIdInput.value = item ? item.id : create.id();
    const formCategory = create.label({
      property: "category",
      type: "select",
    });
    formCategory.id = "info-info-form-category";
    if (item) {
      formCategory.querySelector(".input").value = item.info.category;
    }
    const formType = create.label({
      item: item,
      property: "type",
      type: "text",
    });
    formType.id = "info-info-form-type";
    if (item) {
      formType.querySelector(".input").value = item.info.type;
    }
    const formModel = create.label({
      item: item,
      property: "model",
      type: "text",
    });
    formModel.id = "info-info-form-model";
    if (item) {
      formModel.querySelector(".input").value = item.info.model;
    }
    const formProvince = create.label({
      item: item,
      property: "province",
      type: "select",
    });
    formProvince.id = "info-info-form-province";
    if (item) {
      formProvince.querySelector(".input").value = item.info.province;
    }
    const formStatus = create.label({
      item: item,
      property: "status",
      type: "select",
    });
    formStatus.id = "info-info-form-status";
    if (item) {
      formStatus.querySelector(".input").value = item.info.status;
    }
    const formPrice = create.label({
      item: item,
      property: "price",
      type: "text",
    });
    formPrice.id = "info-info-form-price";
    if (item) {
      formPrice.querySelector(".input").value = item.info.price;
    }
    const form = document.createElement("form");
    form.appendChild(formId);
    form.appendChild(formCategory);
    form.appendChild(formType);
    form.appendChild(formModel);
    form.appendChild(formProvince);
    form.appendChild(formStatus);
    form.appendChild(formPrice);
    const container = document.createElement("section");
    container.id = "info-info";
    container.appendChild(title);
    container.appendChild(form);
    return container;
  }

  static #images(item) {
    const title = document.createElement("h2");
    title.textContent = "Imágenes";
    const list = document.createElement("ul");
    if (item) {
      item.images.forEach((index) => {
        const li = create.structureImage(item, index);
        li.querySelector('input[type="url"]').value = index;
        list.appendChild(li);
      });
    } else {
      list.appendChild(create.structureImage());
    }
    const button = document.createElement("button");
    button.textContent = "Agregar";
    button.addEventListener("click", () => {
      list.appendChild(create.structureImage());
    });
    const container = document.createElement("section");
    container.id = "info-images";
    container.appendChild(title);
    container.appendChild(list);
    container.appendChild(button);
    return container;
  }

  static #specs(item) {
    const title = document.createElement("h2");
    title.textContent = "Especificaciones";
    const list = document.createElement("ul");
    if (item) {
      for (const key in item.specs) {
        const li = create.structureSpecs(item, key);
        list.appendChild(li);
      }
    } else {
      list.appendChild(create.structureSpecs());
    }
    const button = document.createElement("button");
    button.textContent = "Agregar";
    button.addEventListener("click", () => {
      list.appendChild(create.structureSpecs());
    });
    const container = document.createElement("section");
    container.id = "info-specs";
    container.appendChild(title);
    container.appendChild(list);
    container.appendChild(button);
    return container;
  }

  static #buttons() {
    const save = document.createElement("button");
    save.textContent = "Guardar";
    save.addEventListener("click", () => {
      const object = {};
      object.id = document
        .getElementById("info-info-form-id")
        .querySelector(".input").value;
      object.images = [];
      /* Se agregará las imagenes o la url del la imagen cargada en imgbb, para eso llamar
          a la API de imgbb. Evento del boton upload en la linea 77*/
      const containerImages = document
        .getElementById("info-images")
        .querySelector("ul");
      for (let i = 0; i < containerImages.childElementCount; i++) {
        const child = containerImages.children[i];
        const url = child
          .querySelectorAll("label")[0]
          .querySelector(".input").value;
        const upload = child
          .querySelectorAll("label")[1]
          .querySelector(".input").value; //Aqui poner el resultado de la api
      }

      object.info = {
        category: document
          .getElementById("info-info-form-category")
          .querySelector(".input").value,
        type: document
          .getElementById("info-info-form-type")
          .querySelector(".input").value,
        model: document
          .getElementById("info-info-form-model")
          .querySelector(".input").value,
        province: document
          .getElementById("info-info-form-province")
          .querySelector(".input").value,
        status: document
          .getElementById("info-info-form-status")
          .querySelector(".input").value,
        price: document
          .getElementById("info-info-form-price")
          .querySelector(".input").value,
      };
      object.specs = {};
      const containerSpecs = document
        .getElementById("info-specs")
        .querySelector("ul");
      for (let i = 0; i < containerSpecs.childElementCount; i++) {
        const child = containerSpecs.children[i];
        const key = child
          .querySelectorAll("label")[0]
          .querySelector(".input").value;
        const value = child
          .querySelectorAll("label")[1]
          .querySelector(".input").value;
        object.specs[key] = value;
      }

      console.log(object);

      // const sectionInfo = document.getElementById("info");
      // sectionInfo.classList.remove("visible");
      // sectionInfo.innerHTML = "";
    });
    const cancel = document.createElement("button");
    cancel.textContent = "Cancelar";
    cancel.addEventListener("click", () => {
      const sectionInfo = document.getElementById("info");
      sectionInfo.classList.remove("visible");
      sectionInfo.innerHTML = "";
    });
    const container = document.createElement("div");
    container.id = "info-buttons";
    container.appendChild(save);
    container.appendChild(cancel);
    return container;
  }

  static init(item) {
    const container = document.getElementById("info");
    container.scrollTop = 0;
    container.appendChild(information.#info(item));
    container.appendChild(information.#images(item));
    container.appendChild(information.#specs(item));
    container.appendChild(information.#buttons());
  }
}

export default information;
