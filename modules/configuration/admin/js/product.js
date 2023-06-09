import connection from "../../../connection/connection.js";
import auth from "../../../connection/js/auth.js";
import information from "./information.js";

class product {
  static #array;

  static get array() {
    return product.#array;
  }

  static #delete(item) {
    Swal.fire({
      title: `Elimanción del producto ${item.id}`,
      text: `Eliminaras de forma definitiva el producto ${item.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        product.#array.splice(product.#array.indexOf(item), 1);
        auth.put(
          product.#array,
          () => {
            Swal.fire(
              "Eliminado con éxito!",
              `Has eliminado el elemento ${item.id}.`,
              "success"
            );
          },
          () => {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar el producto.",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp",
              },
            });
          }
        );
      }
    });
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
    } else {
      product.#array = array;
    }
    product.#array.forEach((item) => {
      container.appendChild(product.#dom(item));
    });
  }
}

export default product;
