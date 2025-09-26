const parseType = (type) => {
  const allowedTypes = ['work', 'home', 'personal'];

  if (typeof type !== 'string') return;
  if (!allowedTypes.includes(type)) return;

  return type;
};

const parseIsFavourite = (value) => {
  if (typeof value !== 'string') return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
