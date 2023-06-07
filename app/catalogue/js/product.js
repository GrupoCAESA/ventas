import groups from "./product/groups.js";
import connection from "../../../modules/connection/connection.js";

class product {
  static #arrayProducts;

  static #filterResult(item, property) {
    for (const key in connection.variables.filters?.[property]) {
      if (key === item.info?.[property]) {
        return connection.variables.filters[property][key];
      }
    }
    return item.info[property];
  }

  static #infoProduct(item, property) {
    const spanFirst = document.createElement("span");
    spanFirst.textContent =
      connection.variables.filters.transalte[property] || "—";
    const spanLast = document.createElement("span");
    spanLast.textContent = product.#filterResult(item, property) || "—";
    if (property === "price" && spanLast.textContent !== "—") {
      spanLast.textContent = `$ ${spanLast.textContent}`;
    }
    const li = document.createElement("li");
    li.appendChild(spanFirst);
    li.appendChild(spanLast);
    return li;
  }

  static #generateProduct(item) {
    const img = new Image();
    img.classList.add("loadingFile");
    img.alt = item.id;
    connection.loading.image(img, item.images[0]);
    const ul = document.createElement("ul");
    for (const key in item.info) {
      // if (key !== "category") {
      ul.appendChild(product.#infoProduct(item, key));
      // }
    }
    const li = document.createElement("li");
    li.setAttribute("data-products-product", item.id);
    li.appendChild(img);
    li.appendChild(ul);
    li.addEventListener("click", () => {
      window.location.href = `/catalogue/product.html?id="${item.id}"`;
    });
    const container = document.getElementById("products");
    container.appendChild(li);
  }

  static #generateGroupProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";
    products.forEach((item) => {
      product.#generateProduct(item);
    });
  }

  static #buttonGroup(operator = "") {
    const groupSelected = document.querySelector("[data-number_group]");
    const error = document.getElementById("error");
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");
    const containerProducts = document.getElementById("products");
    const containerGroup = document.getElementById("group");
    const title = groupSelected.querySelector("p");
    const text = groupSelected.querySelector("span");
    let number = parseInt(groupSelected.getAttribute("data-number_group"));
    groups.load(product.#arrayProducts);
    if (!number) {
      number = 1;
    }
    if (error.style.display !== "none") {
      error.style.display = "none";
    }
    if (operator === "previous") {
      if (number <= groups.numberArrays) {
        next.style.visibility = "visible";
      }
      if (number === 2) {
        previous.style.visibility = "hidden";
      }
      if (number >= 1 && number <= groups.numberArrays) {
        number--;
      }
    } else if (operator === "next") {
      if (number === groups.numberArrays - 1) {
        next.style.visibility = "hidden";
      }
      if (number >= 1) {
        previous.style.visibility = "visible";
      }
      if (number >= 1 && number <= groups.numberArrays) {
        number++;
      }
    } else {
      previous.style.visibility = "hidden";
      next.style.visibility = groups.numberArrays > 1 ? "visible" : "hidden";
      containerGroup.style.visibility =
        product.#arrayProducts.length > 0 ? "visible" : "hidden";
    }
    if (number >= 1 && number <= groups.numberArrays) {
      groupSelected.setAttribute("data-number_group", number);
      title.textContent = `${number}`;
      text.textContent = `de ${groups.numberArrays}`;
      product.#generateGroupProducts(groups.arraysGroups[number - 1]);
    } else {
      containerProducts.innerHTML = "";
      error.style.display = "flex";
    }
    const main = document.querySelector("main");
    main.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  static #changeGroup() {
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");
    previous.addEventListener("click", () => {
      product.#buttonGroup("previous");
    });
    next.addEventListener("click", () => {
      product.#buttonGroup("next");
    });
  }

  static load(products) {
    const groupsSelected = document.querySelector("[data-number_group]");
    if (product.#arrayProducts !== products) {
      product.#arrayProducts = products;
    }
    groupsSelected.dataset.groups_number = 1;
    product.#buttonGroup();
  }

  static init() {
    product.#arrayProducts = connection.variables.db;
    product.#changeGroup();
    product.#buttonGroup();
  }
}

export default product;
