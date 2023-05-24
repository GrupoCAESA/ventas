const itemsDom = {
  button: document.querySelector("#search>a"),
  search: document.querySelector('#search>input[type="text"]'),
};

function preventSpaces() {
  itemsDom.search.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      alert("Realiza una palabra por búsqueda.");
    }
  });
}

function enter() {
  itemsDom.search.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      itemsDom.button.dispatchEvent(new Event("click"));
    }
  });
}

function send() {
  itemsDom.button.addEventListener("click", () => {
    if (itemsDom.search.value) {
      window.location.href = `/catalogue.html?search="${itemsDom.search.value}"`;
      itemsDom.search.value = "";
    } else {
      alert("Ingrese un valor.");
    }
  });
}

async function search() {
  preventSpaces();
  enter();
  send();
}

export default search;
