function get(url) {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .catch(() => {
      console.error("Cannot connect to the requested resource.");
    });
}

const connect = Object.freeze({
  get,
});

export default connect;
