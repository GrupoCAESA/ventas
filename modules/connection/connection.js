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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body = {},
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
        } else {
          throw new Error("Message not sent.");
        }
      })
      .then(fnResolve)
      .catch((error) => {
        console.error(error);
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

const connection = Object.freeze({
  connect,
  loading,
});

export default connection;