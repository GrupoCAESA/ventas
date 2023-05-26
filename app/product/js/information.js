import variables from "../../catalogue/js/variables.js";
import connection from "../../../modules/connection/connection.js";

class information {
  static #product;

  static #characteristics() {
    const title = document.createElement("h1");
    title.textContent = `${information.#product.info.type} ${
      information.#product.info.model
    }`;
    const header = document.querySelector("header");
    header.appendChild(title);
    const container = document
      .getElementById("information")
      .querySelector("tbody");
    container.innerHTML = `
    <tr>
      <td>CATEGORIA</td>
      <th>${variables.filters.category[information.#product.info.category]}</th>
    </tr>
    <tr>
      <td>TIPO</td>
      <th>${information.#product.info.type}</th>
    </tr>
    <tr>
      <td>MODELO</td>
      <th>${information.#product.info.model}</th>
    </tr>
    <tr>
      <td>PROVINCIA</td>
      <th>${variables.filters.province[information.#product.info.province]}</th>
    </tr>
    <tr>
      <td>ESTADO</td>
      <th>${variables.filters.status[information.#product.info.status]}</th>
    </tr>
    <tr>
      <td>PRECIO</td>
      <th>$ ${information.#product.info.price}</th>
    </tr>
    `;
  }

  static #gallery() {
    const galleryImage = document
      .getElementById("gallery")
      .querySelector("img");
    galleryImage.onload = () => {
      if (galleryImage.classList.contains("loadingFile"))
        galleryImage.classList.remove("loadingFile");
    };
    const list = document.getElementById("gallery").querySelector("ul");
    let numImage = 0;
    information.#product.images.forEach((url) => {
      const image = document.createElement("img");
      image.alt = `${information.#product.id}/${numImage}`;
      image.classList.add("loadingFile");
      if (numImage === 0) {
        connection.loading.image(galleryImage, url);
        galleryImage.alt = numImage;
      }
      connection.loading.image(image, url);
      const li = document.createElement("li");
      li.setAttribute("data-imageGallery", numImage);
      li.appendChild(image);
      li.addEventListener("click", () => {
        galleryImage.src = image.src;
        galleryImage.alt = li.getAttribute("data-imageGallery");
      });
      list.appendChild(li);
      numImage++;
    });
  }

  static #specs() {
    const specs = document.getElementById("specifications");
    const tbody = specs.querySelector("table>tbody");
    if (Object.entries(information.#product.specs).length === 0) {
      specs.style.display = "none";
    }
    for (const key in information.#product.specs) {
      const td = document.createElement("td");
      td.textContent = key.toUpperCase();
      const th = document.createElement("th");
      th.textContent = information.#product.specs[key];
      const tr = document.createElement("tr");
      tr.appendChild(td);
      tr.appendChild(th);
      tbody.appendChild(tr);
    }
  }

  static #enlargedImage() {
    const gallery = document.getElementById("gallery");
    const galleryList = gallery.querySelector("ul");
    const galleryImage = gallery.querySelector("img");
    const contain = document.getElementById("enlarged_image");
    const image = contain.querySelector("img");
    const close = contain.querySelector(".close");
    const before = document.querySelector(".before");
    const after = document.querySelector(".after");

    galleryImage.addEventListener("click", () => {
      const num = parseInt(galleryImage.alt);
      if (num <= 0) before.style.display = "none";
      if (num >= galleryList.childElementCount - 1)
        after.style.display = "none";
      contain.style.display = "flex";

      image.src = galleryImage.src;
      image.alt = galleryImage.alt;
    });

    close.addEventListener("click", () => {
      contain.style.display = "none";
    });

    before.addEventListener("click", () => {
      const num = parseInt(galleryImage.alt) - 1;
      before.style.display =
        num > 0 && num <= information.#product.images.length - 1
          ? "flex"
          : "none";
      if (num >= 0 && num < information.#product.images.length - 1)
        after.style.display = "flex";
      if (num <= galleryList.childElementCount - 1) {
        const imgSelected = galleryList.querySelector(
          `[data-imageGallery="${num}"]>img`
        );

        galleryImage.src = imgSelected.src;
        galleryImage.alt = num;
        image.src = imgSelected.src;
        image.alt = num;
        connection.loading.image(image, information.#product.images[num]);
      }
    });

    after.addEventListener("click", () => {
      const num = parseInt(galleryImage.alt) + 1;
      after.style.display =
        num >= 0 && num < information.#product.images.length - 1
          ? "flex"
          : "none";
      if (num > 0 && num <= information.#product.images.length - 1)
        before.style.display = "flex";
      if (num <= galleryList.childElementCount - 1) {
        const imgSelected = galleryList.querySelector(
          `[data-imageGallery="${num}"]>img`
        );

        galleryImage.src = imgSelected.src;
        galleryImage.alt = num;
        image.src = imgSelected.src;
        image.alt = num;
        connection.loading.image(image, information.#product.images[num]);
      }
    });
  }

  static init() {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const id = JSON.parse(searchParams.get("id"));
    information.#product = variables.db.find((item) => item.id === id);
    if (information.#product) {
      information.#gallery();
      information.#characteristics();
      information.#specs();
      information.#enlargedImage();
    } else {
      window.location.href = "/catalogue.html";
    }
  }
}

export default information;
