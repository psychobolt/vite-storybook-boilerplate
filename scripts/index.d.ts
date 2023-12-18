type Args = Record<string, any>;

interface Tester {
  test: (value: string) => boolean;
}

type Matcher =
  | ((value: any, options?: any) => Tester)
  | ((value?: any[]) => Tester);

interface Filter {
  alias?: string;
  type: any;
  value: string | boolean | RegExp[];
  matcher?: Matcher | RegExp | Tester;
}

type Filters = Record<string, Filter>;
