class connect {
  static get(url) {
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Cannot connect to the requested resource.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static post(
    url,
    {
      headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
      body,
      fnResolve = () => {},
      fnRejected = () => {},
    }
  ) {
    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(fnResolve)
      .catch((error) => {
        fnRejected();
      });
  }
}

class loading {
  static async image(item, url, tries = 2) {
    if (url.includes("drive.google.com")) {
      let link = url;
      link = link.replace(
        "https://drive.google.com/file/d/",
        "http://drive.google.com/uc?export=view&id="
      );
      link = link.replace("/view?usp=share_link", "");
      link = link.replace("/view?usp=sharing", "");
      item.src = link;
    } else {
      item.src = url;
    }

    if (item.classList.contains("errorImage")) {
      item.classList.remove("errorImage");
    }

    item.onload = () => {
      if (item.classList.contains("loadingFile")) {
        item.classList.remove("loadingFile");
      }
    };

    item.onerror = () => {
      if (tries > 0) {
        tries--;
        connection.loading.image(item, url, tries);
      } else {
        item.classList.add("errorImage");
        item.src = "/resources/images/error.webp";
      }
    };
  }
}

class variables {
  static #db;
  static #filters;

  static get db() {
    return variables.#db;
  }

  static get filters() {
    return variables.#filters;
  }

  static async load() {
    if (!variables.#db) {
      // variables.#db = await connect.get(
      //   "/modules/connection/json/db.json"
      // );
      variables.#db = await connect.get("/test/catalogue.json");
    }
    if (!variables.#filters) {
      variables.#filters = await connect.get(
        "/modules/connection/json/filters.json"
      );
    }
  }
}

const connection = Object.freeze({
  connect,
  loading,
  variables,
});

export default connection;
