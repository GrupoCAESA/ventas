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
    for (const key in connection.variables.filters.transalte) {
      const tdFirst = document.createElement("td");
      tdFirst.textContent = `${connection.variables.filters.transalte[key]}`;
      const tdSecond = document.createElement("td");
      const infoValid =
        Boolean(information.#product.info[key]) &&
        information.#product.info[key] !== "all";
      if (
        (key === "category" || key === "province" || key === "status") &&
        infoValid
      ) {
        tdSecond.textContent = `${
          connection.variables.filters[key][information.#product.info[key]]
        }`;
      } else if (infoValid) {
        tdSecond.textContent = `${information.#product.info[key]}`;
      } else {
        tdSecond.textContent = "";
      }
      const tr = document.createElement("tr");
      tr.appendChild(tdFirst);
      tr.appendChild(tdSecond);
      container.appendChild(tr);
    }
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
    if (information.#product.images.length > 0) {
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
    } else {
      document.getElementById("gallery").style.display = "none";
    }
  }

  static #specs() {
    const specs = document.getElementById("specifications");
    const tbody = specs.querySelector("table>tbody");
    if (Object.entries(information.#product.specs).length === 0) {
      specs.style.display = "none";
    }
    for (const key in information.#product.specs) {
      const tdFirst = document.createElement("td");
      tdFirst.textContent = key.toUpperCase();
      const tdSecond = document.createElement("td");
      tdSecond.textContent = information.#product.specs[key];
      const tr = document.createElement("tr");
      tr.appendChild(tdFirst);
      tr.appendChild(tdSecond);
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
    information.#product = connection.variables.db.find(
      (item) => item.id === id
    );
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
