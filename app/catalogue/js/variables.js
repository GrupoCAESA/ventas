import connection from "../../../modules/connection/connection.js";

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
      // variables.#db = await connection.connect.get(
      //   "/app/catalogue/json/db.json"
      // );
      variables.#db = await connection.connect.get("/test/catalogue.json");
    }
    if (!variables.#filters) {
      variables.#filters = await connection.connect.get(
        "/app/catalogue/json/filters.json"
      );
    }
  }
}

export default variables;
