module.exports = function (source) {
  this.cacheable();
  return source.toString().replace("�������", "Комната");
};
