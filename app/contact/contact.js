import animation from "../../modules/animation/animation.js";
import menu from "../../modules/menu/menu.js";
import validity from "./js/form.js";
import generate from "./js/generate.js";

(async () => {
  menu.init();
  validity.form();
  animation.typewriter(
    document.querySelector("header>.typewriter"),
    "Montajes, maniobras, armados, soldadura, acabados, estructura y transportes voluminosos hasta 1200 toneladas."
  );
  await generate.worldMap();
  await generate.construction.init();
})();
