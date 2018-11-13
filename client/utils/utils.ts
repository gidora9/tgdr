import { IAppState } from '../store';
import { IEntriesState, IGetEntriesParams } from '../store/entries';

export const getAuthHeader = (getState: () => IAppState) => {
  const { token } = getState().auth;
  return {
    headers: {
      Authorization: token,
    },
  };
};

export const shortenLongName = (name: string, maxChars: number) =>
  name.length > maxChars ? `${name.slice(0, maxChars)}...` : name;

export const capitalizeFirstLetter = (text: string): string =>
  text[0].toUpperCase() + text.slice(1);

export const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const getOpenLink = (username: string) => (
  e: React.MouseEvent<HTMLElement>
) => {
  e.stopPropagation();
  window.open(`https://t.me/${username}`, '_blank');
  window.focus();
};

export const hasAd = (text: string) =>
  // tslint:disable-next-line:max-line-length
  /((http(s)?(\:\/\/))?(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/gi.test(
    text
  ) || /(@\w+)/gi.test(text);

export const areParamsEqual = (
  params: IGetEntriesParams,
  state: IEntriesState
): boolean =>
  // Number of current entries should be same or more than requested
  params.limit <= state.limit &&
  state.data[params.type][params.sort].length &&
  // If there are categories, they should be equal
  (params.category || state.category
    ? params.category === state.category
    : true);

export const getParamsFromQueries = ({
  category,
  sort,
  type,
  search,
}: IGetEntriesParams): IGetEntriesParams[] => {  
  const searchParam = search && { search };
  
  if (category && sort && type) {
    return [{ category, sort, type }];
  }

  if (sort && type) {
    return [{ sort, type }];
  }

  if (type && !category) {
    return [
      { sort: 'top', type },
      { sort: 'hot', type },
      { sort: 'new', type },
    ];
  }

  if (category && !type) {
    return [
      { category, sort: 'top', type: 'channel' },
      { category, sort: 'top', type: 'bot' },
      { category, sort: 'top', type: 'supergroup' },
    ];
  }

  if (category && type) {
    return [
      { category, sort: 'top', type },
      { category, sort: 'hot', type },
      { category, sort: 'new', type },
    ];
  }

  if (sort) {
    return [
      { ...searchParam, sort, type: 'channel' },
      { ...searchParam, sort, type: 'bot' },
      { ...searchParam, sort, type: 'supergroup' },
    ];
  }

  return [];
};

export const getViewMoreLinkURL = ({
  category,
  sort,
  type,
}: IGetEntriesParams): string => {
  switch (true) {
    case !!category && !!sort && !!type:
      return `${type}/${category}/${sort}`;

    case !!sort && !!type:
      return `${type}/${sort}`;

    case !!type && !category:
      return type;

    case !!category && !type:
      return category;

    case !!category && !!type:
      return `${type}/${category}`;

    case !!sort:
      return sort;

    default:
      return '';
  }
};
