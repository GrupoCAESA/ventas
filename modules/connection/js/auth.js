function rejectedValidation() {
  console.clear();
  window.sessionStorage.removeItem("owner");
  window.sessionStorage.removeItem("pass");
  Swal.fire({
    icon: "error",
    title: "Acceso denegado",
    text: "El usuario o la contraseña.",
    showConfirmButton: false,
    footer:
      '<a href="/modules/configuration/admin/dashboard.html">Intentelo de nuevo</a>',
    allowOutsideClick: false,
  });
}

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

  static async validation(fnResolve = () => {}) {
    const owner = window.sessionStorage.getItem("owner");
    const pass = window.sessionStorage.getItem("pass");
    let token;

    try {
      token = auth.#token(pass);
    } catch (error) {
      rejectedValidation();
    }

    if (Boolean(owner) && Boolean(pass) && Boolean(token)) {
      await fetch(auth.#url(owner), {
        headers: {
          Authorization: `Token ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
        .then((response) => {
          if (response.ok) {
            fnResolve();
          } else {
            throw new Error("");
          }
        })
        .catch(() => {
          rejectedValidation();
        });
    } else {
      rejectedValidation();
    }
  }

  static async put(content = [], fnResolve = () => {}, fnRejected = () => {}) {
    const owner = window.sessionStorage.getItem("owner");
    const pass = window.sessionStorage.getItem("pass");
    let token;

    try {
      token = auth.#token(pass);
    } catch (error) {
      rejectedValidation();
    }

    if (Boolean(owner) && Boolean(pass) && Boolean(token)) {
      await fetch(auth.#url(owner), {
        headers: {
          Authorization: `Token ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            rejectedValidation();
            throw new Error("");
          }
        })
        .then(async (resolve) => {
          await fetch(auth.#url(owner), {
            method: "PUT",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              message: "modification with the GitHub API.",
              content: btoa(JSON.stringify(content)),
              sha: resolve.sha,
            }),
          }).then((res) => {
            if (res.ok) {
              fnResolve();
            } else {
              fnRejected();
              throw new Error("");
            }
          });
        })
        .catch((error) => {
          console.clear();
        });
    }
  }
}

export default auth;
