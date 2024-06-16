import { SORT_ORDER } from '../constants/index.js';

const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

export const parsePaginationParams = query => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

const parseSortOrder = sortOrder => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = sortBy => {
  const keysOfContact = ['name'];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parseSortParams = query => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};

const parseIsFavourite = isFavourite => {
  if (typeof isFavourite !== 'string') return;

  return isFavourite.toLowerCase() === 'true';
};

const parseContactType = contactType => {
  if (typeof contactType !== 'string') return;

  const isType = type => ['personal', 'home', 'work'].includes(contactType);
  if (isType(contactType)) return contactType;
};

export const parseFilterParams = query => {
  const { isFavourite, contactType } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
