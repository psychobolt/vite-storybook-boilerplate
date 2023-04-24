type Args = {
  [key: string]: string
};

type Tester = {
  test: (value: string) => boolean
};

type Matcher = (value: string | string[]) => RegExp | Tester;

type Filter = {
  alias?: string,
  type: any,
  value: string | boolean | RegExp[],
  matcher?: RegExp | Matcher | Tester
};

type Filters = {
  [key: string]: Filter
};