class auth {
  static #url(owner) {
    return `https://api.github.com/repos/${owner}/ventas/contents/modules/connection/json/db.json`;
  }
  static #token(pass) {
    return atob(
      `Z2l0aHViX3BhdF8xMUJBQ1FIMkEwa0hWcFdIdG5GZ1c2X3hXcnNiNmphUGpzMkZHd3drZGZaVThRV1dvaGlrMXc2eFdhWmhhNWo0bUFJRllLTj${atob(
        pass
      )}`
    );
  }

  static async validation(fnResolve = () => {}, fnRejected = () => {}) {
    const owner = window.sessionStorage.getItem("owner");
    const pass = window.sessionStorage.getItem("pass");
    const sha = window.sessionStorage.getItem("sha");
    let token;
    try {
      token = auth.#token(pass);
    } catch (error) {
      console.clear();
      fnRejected();
    }
    if (Boolean(owner) && Boolean(pass) && !Boolean(sha) && Boolean(token)) {
      await fetch(auth.#url(owner), {
        headers: {
          Authorization: `Token ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("");
          }
        })
        .then((resolve) => {
          window.sessionStorage.setItem("sha", resolve.sha);
          fnResolve();
        })
        .catch(() => {
          fnRejected();
          console.clear();
        });
    } else if (Boolean(owner) && Boolean(pass) && Boolean(sha)) {
      fnResolve();
    } else {
      console.clear();
      fnRejected();
    }
  }

  static async put(content = [], fnResolve = () => {}, fnRejected = () => {}) {
    const owner = window.sessionStorage.getItem("owner");
    const pass = window.sessionStorage.getItem("pass");
    const sha = window.sessionStorage.getItem("sha");

    let token;
    try {
      token = auth.#token(pass);
    } catch (error) {
      fnRejected();
      console.clear();
    }
    if (Boolean(sha) && Boolean(owner) && Boolean(pass) && Boolean(token)) {
      await fetch(auth.#url(owner), {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json; charset=UTF-8",
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
          }
        })
        .catch(() => {
          console.clear();
          fnRejected();
        });
    }
  }
}

export default auth;
