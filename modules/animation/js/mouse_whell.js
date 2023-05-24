function horizontal(item, displacement = 50) {
  item.addEventListener("wheel", (event) => {
    event.preventDefault();
    item.scrollBy({
      left: event.deltaY < 0 ? -displacement : displacement,
    });
  });
}

const mouseWhell = Object.freeze({
  horizontal,
});

export default mouseWhell;
