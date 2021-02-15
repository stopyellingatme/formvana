/** Dispatch event on click outside of node */
export function clickOutsideMenu(node) {
  const handleClick = (event) => {
    const menu = document.getElementById("sort-menu");
    if (
      node &&
      !node.contains(event.target) &&
      !event.defaultPrevented &&
      event.target !== menu &&
      event.target.parentNode !== menu
    ) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}

export function clickOutsideDropdown(node) {
  const handleClick = (event) => {
    // const menu = document.getElementById("sort-menu");
    if (
      node &&
      !node.contains(event.target) &&
      !event.defaultPrevented
      // event.target !== menu &&
      // event.target.parentNode !== menu
    ) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
