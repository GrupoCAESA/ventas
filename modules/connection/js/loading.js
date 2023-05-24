async function image(item, url, tries = 2) {
  if (url.includes("drive.google.com")) {
    let link = url;
    link = link.replace(
      "https://drive.google.com/file/d/",
      "http://drive.google.com/uc?export=view&id="
    );
    link = link.replace("/view?usp=share_link", "");
    link = link.replace("/view?usp=sharing", "");
    item.src = link;
  } else {
    item.src = url;
  }

  if (item.classList.contains("errorImage")) {
    item.classList.remove("errorImage");
  }

  item.onload = () => {
    if (item.classList.contains("loadingFile")) {
      item.classList.remove("loadingFile");
    }
  };

  item.onerror = () => {
    if (tries > 0) {
      tries--;
      image(item, url, tries);
    } else {
      item.classList.add("errorImage");
      item.src = "/Assets/Src/Images/Error.webp";
    }
  };
}

const loading = Object.freeze({
  image,
});

export default loading;
