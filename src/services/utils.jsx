export const setItem = (key, data) => {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data)); // Store data as JSON string
  }
};

export const getItem = (key) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

export const removeItem = (keys) => {
  if (typeof keys === "string") {
    localStorage.removeItem(keys); // Remove the single item
  } else if (Array.isArray(keys)) {
    keys.forEach((key) => {
      localStorage.removeItem(key); // Remove each item from the array
    });
  }
};
