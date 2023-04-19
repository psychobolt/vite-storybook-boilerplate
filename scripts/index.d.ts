type Args = {
  [key: string]: string
};

type Matcher = (value: string) => RegExp;

type Filter = {
  alias?: string,
  type: any,
  value: string | boolean,
  matcher?: RegExp | Matcher
};

type Filters = {
  [key: string]: Filter
};