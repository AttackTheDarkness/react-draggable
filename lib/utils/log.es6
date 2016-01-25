export default function log(str, data) {
  if (process.env.DRAGGABLE_DEBUG) arguments.length > 1 ? console.log(str, data) : console.log(str);
}
