import connect from "../../connection/js/connect.js";

function movin({
  path,
  container,
  item = container,
  loop = false,
  autoplay = false,
}) {
  if (item !== container) {
    item = container + item;
  }

  const icon = bodymovin.loadAnimation({
    container: document.querySelector(item),
    path: path,
    render: "svg",
    loop: loop,
    autoplay: autoplay,
  });

  const contain = document.querySelector(container);

  if (!autoplay) {
    contain.addEventListener("mouseenter", () => {
      icon.play();
    });

    contain.addEventListener("mouseleave", () => {
      icon.stop();
    });
  }
}

async function lottie(url) {
  let ics = await connect.get(url);
  ics.forEach((ic) => {
    movin(ic);
  });
}

export default lottie;
