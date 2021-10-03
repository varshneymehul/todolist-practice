exports.getDate = function() {
let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let today = new Date();
  return date = today.toLocaleDateString("en-GB", options);
}
exports.getDay = function() {
let options = {
    weekday: "long",
  };
  let today = new Date();
  return day = today.toLocaleDateString("en-GB", options);
}
