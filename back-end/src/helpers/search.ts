export function userExists(userId: any, array: Array<String>) {
  return array.some(function (el: any) {
    return el.userId === userId;
  });
}
export function emailExists(email: any, array: Array<String>) {
  return array.some(function (el: any) {
    return el.IdEmail === email;
  });
}
export function SubExists(email: any, array: Array<String>) {
  return array.some(function (el: any) {
    return el.IdChannal === email;
  });
}
