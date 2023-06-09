class auth {
  static #url;
  static #token;

  static async validation(fnResolve = () => {}, fnRejected = () => {}) {
    const owner = window.sessionStorage.getItem("owner");
    const pass = window.sessionStorage.getItem("pass");
    const sha = window.sessionStorage.getItem("sha");

    if (Boolean(owner) && Boolean(pass) && !Boolean(sha)) {
      try {
        auth.#token = `Z2l0aHViX3BhdF8xMUJBQ1FIMkEwa0hWcFdIdG5GZ1c2X3hXcnNiNmphUGpzMkZHd3drZGZaVThRV1dvaGlrMXc2eFdhWmhhNWo0bUFJRllLTj${atob(
          pass
        )}`;
      } catch (error) {
        fnRejected();
        return;
      }

      auth.#url = `https://api.github.com/repos/${owner}/ventas/contents/modules/connection/json/db.json`;
      let token;

      try {
        token = atob(auth.#token);
      } catch (error) {
        fnRejected();
        return;
      }

      await fetch(auth.#url, {
        headers: {
          Authorization: `Token ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((resolve) => {
          window.sessionStorage.setItem("sha", resolve.sha);
          fnResolve();
        })
        .catch(() => {
          fnRejected();
        });
    } else if (Boolean(owner) && Boolean(pass) && Boolean(sha)) {
      fnResolve();
    } else {
      fnRejected();
    }
  }

  static put(content = [], fnResolve = () => {}, fnRejected = () => {}) {
    const sha = window.sessionStorage.getItem("sha");
    if (Boolean(sha)) {
      return fetch(auth.#url, {
        method: "PUT",
        headers: {
          Authorization: `Token ${atob(auth.#token)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "modification with the GitHub API.",
          content: btoa(JSON.stringify(content)),
          sha: sha,
        }),
      })
        .then((response) => {
          if (response.ok) {
            fnResolve();
          } else {
          }
        })
        .catch(() => {
          fnRejected();
        });
    }
  }
}

export default auth;
