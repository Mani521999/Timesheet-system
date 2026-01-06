/** values are empty or not */
export const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (typeof value === 'number' && value !== 0 && value.length === 0);



/** values are empty or not */
export const sendResponse = (res, data = {}) => {
    res.status(data.statusCode).json(data)
}


/** Calculate total hours worked */
export const calculateHours = (punchIn, punchOut) => {
  const start = new Date(`1970-01-01T${punchIn}`);
  const end = new Date(`1970-01-01T${punchOut}`);
  const hours = (end - start) / (1000 * 60 * 60);
console.log('Hours', hours, punchIn, punchOut);

  if (hours < 5 || hours > 8) {
    throw new Error("Total hours must be between 5 and 8");
  }
  return Number(hours.toFixed(2));
};


/** Deep flatten an object */
export const deepFlatten = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = key;
    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.assign(acc, deepFlatten(item, `${newKey}_${index + 1}`));
        } else {
          acc[`${newKey}_${index + 1}`] = item;
        }
      });
    } 
    else if (typeof value === "object" && value !== null) {
      Object.assign(acc, deepFlatten(value, newKey));
    } 
    else {
      acc[newKey] = value;
    }

    return acc;
  }, {});
};
