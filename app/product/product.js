import menu from "../../modules/menu/menu.js";
import variables from "../catalogue/js/variables.js";
import animation from "../../modules/animation/animation.js";
import information from "./js/information.js";

(async () => {
  await variables.load();
  menu.init();
  information.init();
  animation.mouseWhell.horizontal(
    document.getElementById("gallery").querySelector("ul")
  );
})();
