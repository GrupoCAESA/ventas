import animation from "../../../animation/animation.js";
import connection from "../../../connection/connection.js";
import auth from "../../../connection/js/auth.js";
import product from "../js/product.js";
import topBar from "../js/topBar.js";

class validationUser {
  static #rejected() {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  }

  static async #validity() {
    await auth.validation(async () => {
      document.querySelector("body").innerHTML = `<header>
          <label id="search">
            <i></i>
            <input type="text" placeholder="Búsqueda por ID">
          </label>
          <button id="new_product">Nuevo</button>
        </header>
        <main>
          <ul id="products"></ul>
        </main>
        <footer></footer>
        <aside id="info"></aside>
        <aside id="bad_size">
          <span>Se requiere de una pantalla más grande.</span>
        </aside>`;
      await connection.variables.load();
      animation.lottie.generate(
        "/modules/configuration/admin/json/lottie-icons.json"
      );
      product.init();
      topBar.init();
    });
  }
  static async init() {
    const sessOwner = window.sessionStorage.getItem("owner");
    const sessPass = window.sessionStorage.getItem("pass");
    if (Boolean(sessOwner) && Boolean(sessPass)) {
      validationUser.#validity();
    } else {
      const { value: owner } = await Swal.fire({
        title: "Usuario",
        input: "text",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Escribe un usuario";
          }
        },
        allowOutsideClick: false,
      });

      if (Boolean(owner)) {
        const { value: pass } = await Swal.fire({
          title: "Contraseña",
          input: "password",
          inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off",
          },
          inputValidator: (value) => {
            if (!value) {
              return "Escribe una contraseña.";
            }
          },
          allowOutsideClick: false,
        });

        if (Boolean(pass)) {
          window.sessionStorage.setItem("owner", owner);
          window.sessionStorage.setItem("pass", pass);
          validationUser.#validity();
        } else {
          validationUser.#rejected();
        }
      } else {
        validationUser.#rejected();
      }
    }
  }
}

export default validationUser;
