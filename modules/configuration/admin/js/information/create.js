import connection from "../../../../connection/connection.js";

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
      case "url":
        input = document.createElement("input");
        input.type = type;
        input.addEventListener("keydown", (event) => {
          if (event.key === " ") {
            event.preventDefault();
          }
        });
        break;
      default:
        input = document.createElement("input");
        input.type = type;
        break;
    }
    return input;
  }

  static label({ type = "", property = "", id = "" }) {
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
    if (Boolean(id)) {
      label.id = id;
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
      const file = event.target.files[0];
      const apiKey = "N2I4YWRjMDM0NjA5NTU1ZDk0OTMzZTQ5ZWE2NjAyNDA=";
      if (file.size < 33554432) {
        const formData = new FormData();
        formData.append("image", file);
        fetch(`https://api.imgbb.com/1/upload?key=${atob(apiKey)}`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data.display_url) {
              labelUrl.querySelector(".input").value = data.data.display_url;
            }
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Imagen cargada!",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "No se pudo cargar la imagen.",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp",
              },
            });
          });
      }
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

export default create;
