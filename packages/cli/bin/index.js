#!/usr/bin/env node

// src/index.ts
import LZString from "lz-string";
import open from "open";
import simpleGit from "simple-git";

// src/helpers/args.ts
var [, , ...args] = process.argv;
var currentBranchOnly = args.includes("--current") || args.includes("-c");
var args_default = {
  currentBranchOnly
};

// src/helpers/git/get-all-branches.ts
async function getAllBranches() {
  const branches = await git.branchLocal(['--format="%(refname:short)"']);
  return branches.all.map((branch) => branch.replace(/"/g, ""));
}

// src/helpers/git/get-contributors.ts
import { execSync } from "node:child_process";
async function getContributors() {
  const contributors = /* @__PURE__ */ new Map();
  const logOutput = execSync(
    'git log --pretty=format:"|||%n%an <%ae> %ad" --date=unix --shortstat',
    { encoding: "utf-8" }
  );
  let currentContributor = "";
  const splittedLog = logOutput.split("|||");
  splittedLog.forEach((line) => {
    const authorMatch = line.match(/(.+) <(.+)> (.+)/);
    if (!authorMatch) {
      return;
    }
    const [, name, email, date] = authorMatch;
    const key = `${name}|${email}`;
    if (!contributors.has(key)) {
      contributors.set(key, {
        n: name,
        e: email,
        c: [],
        o: 0,
        loc: 0,
        rm: 0
      });
    }
    currentContributor = key;
    const contributor = contributors.get(key);
    const commit = {
      d: date
    };
    if (currentContributor) {
      const { deletions, insertions } = extractChanges(line);
      contributor.loc += insertions;
      contributor.rm += deletions;
    }
    contributor.c.push(commit);
  });
  return contributors;
}
var extractChanges = (line) => {
  const locMatch = line.match(/(\d+) insertions?\(\+\)/);
  const rmMatch = line.match(/(\d+) deletions?\(-\)/);
  const insertions = locMatch ? Number.parseInt(locMatch[1], 10) : 0;
  const deletions = rmMatch ? Number.parseInt(rmMatch[1], 10) : 0;
  return { insertions, deletions };
};

// src/helpers/git/get-current-branch.ts
async function getCurrentBranch() {
  const currentBranch = (await git.branchLocal(['--format="%(refname:short)"'])).current;
  return [currentBranch];
}

// src/helpers/git/get-line-ownership.ts
import { execSync as execSync3 } from "node:child_process";

// src/helpers/git/get-repo-root.ts
import { execSync as execSync2 } from "node:child_process";
var getRepoRoot = () => {
  return execSync2("git rev-parse --show-toplevel", {
    encoding: "utf-8"
  }).trim();
};

// src/helpers/git/get-line-ownership.ts
async function getLineOwnership(contributors) {
  const repoRoot = getRepoRoot();
  const blameOutput = execSync3(
    `git -C "${repoRoot}" ls-tree -r -z --name-only HEAD | while IFS= read -r -d '' file; do git -C "${repoRoot}" blame --line-porcelain "$file" | grep '^author '; done | sort | uniq -c | sort -nr`,
    { encoding: "utf-8", shell: "/bin/bash" }
  );
  blameOutput.split("\n").forEach((line) => {
    const match = line.trim().match(/(\d+)\s+author (.+)/);
    if (match) {
      const [, count, name] = match;
      for (const key of contributors.keys()) {
        if (key.startsWith(`${name}|`)) {
          contributors.get(key).o = Number.parseInt(count);
        }
      }
    }
  });
}

// src/helpers/git/get-repo-name.ts
import { basename } from "node:path";
var getRepoName = () => basename(getRepoRoot());

// src/index.ts
var git = simpleGit();
var getGitStats = async () => {
  const repoName = await getRepoName();
  const branches = args_default.currentBranchOnly ? await getCurrentBranch() : await getAllBranches();
  const currentBranch = (await git.branchLocal(['--format="%(refname:short)"'])).current;
  const branchData = [];
  for (const branch of branches) {
    await git.checkout(branch);
    const contributors = await getContributors();
    await getLineOwnership(contributors);
    branchData.push({
      n: branch,
      co: Array.from(contributors.values())
    });
  }
  await git.checkout(currentBranch);
  const data = {
    t: repoName,
    b: branchData
  };
  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify(data)
  );
  const clientUrl = process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://git-viz.netlify.app";
  const url = `${clientUrl}/stats/?q=${compressed}`;
  await open(url);
  return data;
};
getGitStats();
export {
  getGitStats,
  git
};
