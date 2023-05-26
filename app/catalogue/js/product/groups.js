class groups {
  static #maxView = 16;
  static #arraysProducts;
  static #arraysGroups;
  static #numberArrays;

  static #numberGroups() {
    groups.#numberArrays = Math.floor(
      groups.#arraysProducts.length / groups.#maxView
    );
    const res = groups.#arraysProducts.length % groups.#maxView;
    if (res > 0) {
      groups.#numberArrays++;
    }
  }

  static #defineGroups() {
    groups.#arraysGroups = [];
    let pos = 0;
    for (let i = 0; i < groups.#numberArrays; i++) {
      const subarray = [];
      for (
        let j = 0;
        j <= groups.#maxView - 1 && pos < groups.#arraysProducts.length;
        j++
      ) {
        subarray.push(groups.#arraysProducts[pos]);
        pos++;
      }
      groups.#arraysGroups.push(subarray);
    }
  }

  static get arraysGroups() {
    return groups.#arraysGroups;
  }

  static get numberArrays() {
    return groups.#numberArrays;
  }

  static load(products) {
    groups.#arraysProducts = products;
    groups.#numberGroups();
    groups.#defineGroups();
  }
}

export default groups;
