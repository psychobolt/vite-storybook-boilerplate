type Args = Record<string, any>;

interface Tester {
  test: (value: string) => boolean;
}

type Matcher =
  | ((value: any, options?: any) => Tester)
  | ((value?: any[]) => Tester);

interface Spec {
  alias?: string;
  key?: string;
  type: any;
}

interface Filter extends Spec {
  value: string | boolean | RegExp[];
  matcher?: Matcher | RegExp | Tester;
}

type Filters = Record<string, Filter>;

type SemVer = Record<string, string>;

interface Workspace {
  name: string;
  location: string;
}

type Mapper<T> = (workspaces: Workspace[], result?: unknown) => T;

interface Formatter extends Spec {
  value: string[];
  mapper: (type: string[]) => Mapper<any>;
}

type Formatters = Record<string, Formatter>;
