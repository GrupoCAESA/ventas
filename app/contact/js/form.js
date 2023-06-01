import connection from "../../../modules/connection/connection.js";

class validityInput {
  constructor({ input, messages = {}, regex = "" }) {
    this.#input = input;
    this.#messages = messages;
    this.#regex = new RegExp(regex);
    this.#focus();
    this.#validityMessage();
    this.#validityRegex();
    input.addEventListener("input", () => {
      this.#validityMessage();
    });
  }

  #input;
  #messages;
  #regex;

  #focus() {
    this.#input.addEventListener("focus", () => {
      this.#input.closest("label").classList.add("input-google_style");
    });
    this.#input.addEventListener("blur", () => {
      if (this.#input.value.length === 0) {
        this.#input.closest("label").classList.remove("input-google_style");
      }
    });
  }

  #validityMessage() {
    let msg = "";
    for (const key in this.#input.validity) {
      if (
        !this.#input.validity.valid &&
        this.#input.validity?.[key] &&
        Boolean(this.#messages?.[key])
      ) {
        msg = this.#messages[key];
        break;
      }
    }
    this.#input.setCustomValidity(msg);
  }

  #validityRegex() {
    this.#input.addEventListener("keydown", (event) => {
      const key = event.key;
      if (event.target.value.endsWith(" ") && key === " ") {
        event.preventDefault();
      }
      if (event.target.value.endsWith("\n\n") && key === "Enter") {
        event.preventDefault();
      }
      if (!this.#regex.test(key) && key !== "Enter") {
        event.preventDefault();
        if (this.#messages.patternMismatch) {
          this.#input.setCustomValidity(this.#messages.patternMismatch);
          this.#input.reportValidity();
        }
      }
    });
  }

  sanitized() {
    this.#input.value = this.#input.value.trim();
    this.#input.value = this.#input.value.replace("<script>", "");
    this.#input.value = this.#input.value.replace("</script>", "");
  }

  get valid() {
    return this.#input.validity.valid;
  }

  get value() {
    return this.#input.value;
  }

  sendSuccess() {
    this.#input.value = "";
    this.#input.closest("label").classList.remove("input-google_style");
  }

  validity() {
    this.sanitized();
    this.#validityMessage();
    if (!this.#input.validity.valid && Boolean(this.#input.validationMessage)) {
      this.#input.reportValidity();
    }
  }
}

function form() {
  const name = new validityInput({
    input: document.getElementById("form-name"),
    messages: {
      valueMissing: "Ingrese un nombre",
      patternMismatch: "El nombre solo debe contener letras",
    },
    regex: /[A-Za-z\s]+$/,
  });

  const email = new validityInput({
    input: document.getElementById("form-email"),
    messages: {
      valueMissing: "Ingrese un correo electónico",
      patternMismatch:
        "El correo electónico solo puede contener letras, numeros, puntos (.)",
    },
    regex: /[A-Za-z.@\d]+$/,
  });

  const issue = new validityInput({
    input: document.getElementById("form-issue"),
    messages: {
      valueMissing: "Ingrese un asunto",
      patternMismatch: "El nombre solo debe contener letras",
    },
    regex: /[A-Za-z\s]+$/,
  });

  const message = new validityInput({
    input: document.getElementById("form-message"),
    regex: /[A-Za-z@()!¡$#'%/,.?¿\d\s]+$/,
  });

  const button = document.getElementById("button-send");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    message.validity();
    issue.validity();
    email.validity();
    name.validity();
    if (message.valid && issue.valid && email.valid && name.valid) {
      connection.connect.post(
        "https://formsubmit.co/ajax/ventas@grupocaesa.com.mx",
        {
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: issue.value,
            message: message.value,
          }),
          fnResolve: () => {
            Swal.fire({
              position: "top-end",
              customClass: {
                popup: "sweetAlert-popup",
                title: "sweetAlert-title",
              },
              icon: "success",
              title: "Mensaje enviado.",
              showConfirmButton: false,
              timer: 3000,
            });
            name.sendSuccess();
            email.sendSuccess();
            issue.sendSuccess();
            message.sendSuccess();
            button.querySelector("i").style.display = "none";
            button.querySelector("p").textContent = "Enviado";
            button.setAttribute("disabled", "disabled");
          },
          fnRejected: () => {
            Swal.fire({
              position: "top-end",
              customClass: {
                popup: "sweetAlert-popup",
                title: "sweetAlert-title",
              },
              icon: "error",
              title: "Error al enviar mensaje.",
              showConfirmButton: false,
              timer: 3000,
            });
          },
        }
      );
    }
  });
}

const validity = Object.freeze({
  form,
});

export default validity;
