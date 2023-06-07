import connection from "../../modules/connection/connection.js";
import menu from "../../modules/menu/menu.js";
import animation from "../../modules/animation/animation.js";
import information from "./js/information.js";

(async () => {
  await connection.variables.load();
  menu.init();
  information.init();
  animation.mouseWhell.horizontal(
    document.getElementById("gallery").querySelector("ul")
  );
})();
