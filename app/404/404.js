import animation from "../../modules/animation/animation.js";
import menu from "../../modules/menu/menu.js";

(() => {
  menu.init();
  animation.lottie.generate("/app/404/json/lottie-icons.json");
})();
