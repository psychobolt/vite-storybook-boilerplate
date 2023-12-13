type Args = Record<string, any>;

interface Tester {
  test: (value: string) => boolean;
}

type Matcher =
  | ((value: string, options?: any) => Tester)
  | ((value?: never[]) => Tester)
  | ((value?: string[]) => Tester);

interface Filter {
  alias?: string;
  type: any;
  value: string | boolean | RegExp[];
  matcher?: Matcher | RegExp | Tester;
}

type Filters = Record<string, Filter>;
