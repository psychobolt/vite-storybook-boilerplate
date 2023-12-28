import arg from "arg";
import { $ } from "execa";
import semver from "semver";

import getWorkspaces from "./ls-workspaces.ts";

enum Strategy {
  build,
  launch,
  stable,
}

const args = arg({
  "--strategy": String,
});

const type = args["--strategy"] ?? Strategy[Strategy.build];

async function* getTagAnnotation() {
  await $`git fetch --tags --force`;
  const { stdout: tags } = await $`git tag`;
  for await (const tag of tags.split("\n")) {
    const { stdout } =
      await $`git tag -l --format="%(contents:subject)" ${tag}`;
    yield stdout.slice(1, -1);
  }
}

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
    const target = versions[pkg];
    if (!version || semver.gt(target, version)) {
      latest[pkg] = target;
    }
  }
}

const current: SemVer = await getWorkspaces({
  format: ["semver"],
  noPrivate: true,
});
const prev = { ...current };

switch (type) {
  case Strategy[Strategy.launch]:
  case Strategy[Strategy.stable]: {
    const { stdout } = $.sync`yarn version apply --all --json`;
    if (stdout === "") process.exit();
    for (const line of stdout.split("\n")) {
      try {
        const { ident, newVersion }: SemVer = JSON.parse(line);
        current[ident] = newVersion;
      } catch (e) {
        continue;
      }
    }
  }
}

for (const name in current) {
  const highest = latest[name];
  const oldVersion = prev[name];
  const version = current[name];
  let bump = null;

  if (typeof highest === "undefined")
    throw Error(
      "Latest relasted version not found. Did you run launch workflow?",
    );

  if (version === oldVersion) continue;

  switch (type) {
    case Strategy[Strategy.build]:
      bump = semver.inc(version, "prerelease", "dev", "1");
      break;
    case Strategy[Strategy.launch]:
      if (semver.lt(version, "1.0.0")) {
        bump = "major";
      } else if (semver.lte(version, highest)) {
        bump = "minor";
      }
      break;
    case Strategy[Strategy.stable]: {
      if (oldVersion === highest || semver.lt(version, highest)) break;
      const prerelease = semver.prerelease(oldVersion);
      let release;
      if (prerelease != null) {
        release = "prerelease";
      } else {
        const diff: string = semver.diff(version, oldVersion) ?? "prepatch";
        release = diff.startsWith("pre") ? diff : `pre${diff}`;
      }
      bump = semver.inc(oldVersion, release as semver.ReleaseType, "rc", "1");
    }
  }

  const prerelease = bump == null ? null : semver.prerelease(bump);

  if (bump) {
    for (
      let i = 0;
      i < (prerelease == null ? 1 : 2);
      i += 1 // https://github.com/yarnpkg/berry/issues/3868
    )
      $.sync`yarn workspace ${name} version ${bump}`;
  }
}
