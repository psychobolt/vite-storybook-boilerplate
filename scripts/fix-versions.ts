import { $ } from "execa";
import semver from "semver";

async function* getTagAnnotation() {
  const { stdout: tags } = await $`git tag`;
  for await (const tag of tags.split("\n")) {
    const { stdout } =
      await $`git tag -l --format="%(contents:subject)" ${tag}`;
    yield stdout.slice(1, -1);
  }
}

type SemVer = Record<string, string>;

const latest: SemVer = {};

for await (const annotation of getTagAnnotation()) {
  let versions: SemVer;
  try {
    versions = JSON.parse(annotation);
  } catch (e) {
    continue;
  }

  for (const pkg in versions) {
    const version = latest[pkg];
    const current = versions[pkg];
    if (!version || semver.gt(current, version)) {
      latest[pkg] = current;
    }
  }
}

for (const pkg in latest) {
  $.sync`yarn workspace ${pkg} version ${latest[pkg]} --deferred`;
}
