import { $ } from "execa";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import type { Scalar } from "yaml";
import {
  parseDocument,
  visit,
  isMap,
  isSeq,
  YAMLMap,
  YAMLSeq,
  Pair,
} from "yaml";

const { stdout } = $.sync`yarn turbo run //#config-ci --dry-run=json`;
const [, info] = stdout.match(/(\{\n(\s+.+)*\n\})/) ?? [];
const FILENAME = "bitbucket-pipelines.yml";
const globalHash: string =
  JSON.parse(info).globalCacheInputs.hashOfExternalDependencies;
const doc = parseDocument(readFileSync(resolve(FILENAME), "utf-8"));
const HASH_REGEX = /[a-f0-9]{16}$/;

function pin(key: Scalar<string>) {
  return HASH_REGEX.test(key.value)
    ? key.value.replace(HASH_REGEX, globalHash)
    : `${key.value}-${globalHash}`;
}

const target = "caches";

visit(doc, {
  Pair(_, pair) {
    const { key, value } = pair as Pair<Scalar, unknown>;
    if (key.value === target) {
      if (isMap(value)) {
        const caches = new YAMLMap();
        value.items.forEach(({ key, value }) => {
          caches.add(
            new Pair(pin(key as Scalar<string>), (value as YAMLMap).clone()),
          );
        });
        return new Pair(target, caches);
      } else if (isSeq(value)) {
        const caches = new YAMLSeq();
        value.items.forEach((item) => {
          caches.add(pin(item as Scalar<string>));
        });
        return new Pair(target, caches);
      }
    }
  },
});

writeFileSync(resolve(FILENAME), doc.toString());
