export const fixDate = (el) => {
  let fixedDate = (el.fecha_nacimiento = el.fecha_nacimiento
    .toLocaleDateString()
    .split("/")
    .reverse());
  fixedDate[1] = fixDayMonth(fixedDate[1]);
  fixedDate[2] = fixDayMonth(fixedDate[2]);
  el.fecha_nacimiento = fixedDate.join("-");
  return el;
};

const fixDayMonth = (_str) => {
  if (parseInt(_str) < 10) {
    return `${0}${_str}`;
  } else {
    return _str;
  }
};
