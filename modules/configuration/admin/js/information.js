import auth from "../../../connection/js/auth.js";
import create from "./information/create.js";
import product from "./product.js";

class information {
  static #item;

  static #info() {
    const title = document.createElement("h2");
    title.textContent = "Información";
    const formId = create.label({
      property: "id",
      type: "text",
      id: "info-info-form-id",
    });
    const formIdInput = formId.querySelector(".input");
    formIdInput.disabled = "disabled";
    formIdInput.value = information.#item ? information.#item.id : create.id();

    const formCategory = create.label({
      property: "category",
      type: "select",
      id: "info-info-form-category",
    });
    if (information.#item) {
      formCategory.querySelector(".input").value =
        information.#item.info.category;
    }

    const formType = create.label({
      property: "type",
      type: "text",
      id: "info-info-form-type",
    });
    if (information.#item) {
      formType.querySelector(".input").value = information.#item.info.type;
    }

    const formModel = create.label({
      property: "model",
      type: "text",
      id: "info-info-form-model",
    });
    if (information.#item) {
      formModel.querySelector(".input").value = information.#item.info.model;
    }

    const formProvince = create.label({
      property: "province",
      type: "select",
      id: "info-info-form-province",
    });
    if (information.#item) {
      formProvince.querySelector(".input").value =
        information.#item.info.province;
    }
    const formStatus = create.label({
      property: "status",
      type: "select",
      id: "info-info-form-status",
    });
    if (information.#item) {
      formStatus.querySelector(".input").value = information.#item.info.status;
    }

    const formPrice = create.label({
      property: "price",
      type: "text",
      id: "info-info-form-price",
    });
    if (information.#item) {
      formPrice.querySelector(".input").value = information.#item.info.price;
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

  static #images() {
    const title = document.createElement("h2");
    title.textContent = "Imágenes";

    const list = document.createElement("ul");
    if (information.#item) {
      information.#item.images.forEach((index) => {
        const li = create.structureImage(information.#item, index);
        li.querySelector('input[type="url"]').value = index;
        list.appendChild(li);
      });
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

  static #specs() {
    const title = document.createElement("h2");
    title.textContent = "Especificaciones";

    const list = document.createElement("ul");
    if (information.#item) {
      for (const key in information.#item.specs) {
        const li = create.structureSpecs(information.#item, key);
        list.appendChild(li);
      }
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
    save.addEventListener("click", async () => {
      const object = {};
      object.id = document
        .getElementById("info-info-form-id")
        .querySelector(".input").value;
      object.images = [];
      const containerImages = document
        .getElementById("info-images")
        .querySelector("ul");
      for (let i = 0; i < containerImages.childElementCount; i++) {
        const child = containerImages.children[i];
        const url = child
          .querySelectorAll("label")[0]
          .querySelector(".input").value;
        if (Boolean(url)) {
          object.images.push(url);
        }
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

      const array = product.array;
      const index = array.findIndex((item) => item.id === object.id);

      if (index >= 0) {
        array[index] = object;
      } else {
        array.push(object);
      }

      await auth.put(
        array,
        () => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto creado!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            product.init(array);
            const sectionInfo = document.getElementById("info");
            sectionInfo.classList.remove("visible");
            sectionInfo.innerHTML = "";
          });
        },
        () => {
          Swal.fire({
            icon: "error",
            title: "No se pudo agregar el producto.",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          }).then(() => {
            const sectionInfo = document.getElementById("info");
            sectionInfo.classList.remove("visible");
            sectionInfo.innerHTML = "";
          });
        }
      );
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

  static #clone(obj) {
    if (obj == undefined || obj == null || typeof obj !== "object") {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj);
    }

    if (obj instanceof RegExp) {
      return new RegExp(obj);
    }

    let clonedObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
      clonedObj[key] = information.#clone(obj[key]);
    }

    return clonedObj;
  }

  static init(item) {
    information.#item = information.#clone(item);
    const container = document.getElementById("info");
    container.scrollTop = 0;
    container.appendChild(information.#info());
    container.appendChild(information.#images());
    container.appendChild(information.#specs());
    container.appendChild(information.#buttons());
  }
}

export default information;
