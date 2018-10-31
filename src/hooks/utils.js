export function warn(...args) {
  if (console && console.warn) {
    if (typeof args[0] === 'string') args[0] = `react-i18next:: ${args[0]}`;
    console.warn.apply(null, args);
  }
}

const alreadyWarned = {};
export function warnOnce(...args) {
  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn(...args);
}

export function deprecated(...args) {
  if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
    if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
    warnOnce(...args);
  }
}
