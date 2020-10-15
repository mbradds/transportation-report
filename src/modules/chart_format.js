export function creditsClick(obj,link) {
  obj.credits.element.onclick = function () {
    window.open(link, "_blank");
  };
}
