#!/usr/bin/env node

// src/index.ts
import LZString from "lz-string";
import open from "open";
import simpleGit from "simple-git";

// src/helpers/args.ts
var [, , ...args] = process.argv;
var currentBranchOnly = args.includes("--current") || args.includes("-c");
var getOwnership = args.includes("--owner") || args.includes("-o");
var args_default = {
  currentBranchOnly,
  getOwnership
};

// src/helpers/git/get-all-branches.ts
async function getAllBranches() {
  const branches = await git.branchLocal(['--format="%(refname:short)"']);
  return branches.all.map((branch) => branch.replace(/"/g, ""));
}

// src/helpers/git/get-contributors.ts
import { execSync } from "node:child_process";

// src/helpers/convert-iso-to-unix.ts
function convertIsoToUnix(isoDate) {
  const date = new Date(isoDate);
  const unixTimestamp = Math.floor(date.getTime() / 1e3);
  return unixTimestamp;
}

// src/helpers/git/update-contributor-commits.ts
function updateContributorCommits(contributor, isoDate) {
  const date = new Date(isoDate);
  const hour = date.getUTCHours();
  const month = String(
    Number(date.toISOString().split("-")[1].replace("0", "")) - 1
  );
  contributor.c.cph[hour] = (contributor.c.cph[hour] || 0) + 1;
  contributor.c.cpm[month] = (contributor.c.cpm[month] || 0) + 1;
}

// src/helpers/git/get-contributors.ts
async function getContributors() {
  const contributors = /* @__PURE__ */ new Map();
  const maxBuffer = 1024 * 1024 * 50;
  const logOutput = execSync(
    'git log -n 3000 --pretty=format:"|||%n%an <%ae> %ad" --date=iso --shortstat',
    { encoding: "utf-8", maxBuffer }
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
      const commitsPerHour = Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => [i.toString(), 0])
      );
      const commitsPerMonth = Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i.toString(), 0])
      );
      contributors.set(key, {
        n: name,
        e: email,
        c: {
          cph: commitsPerHour,
          cpm: commitsPerMonth,
          f: String(convertIsoToUnix(date)),
          l: ""
        },
        o: 0,
        loc: 0,
        rm: 0
      });
    }
    currentContributor = key;
    const contributor = contributors.get(key);
    updateContributorCommits(contributor, date);
    contributor.c.l = String(convertIsoToUnix(date));
    if (currentContributor) {
      const { deletions, insertions } = extractChanges(line);
      contributor.loc += insertions;
      contributor.rm += deletions;
    }
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

// src/helpers/logger.ts
var colors = {
  reset: "\x1B[0m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  red: "\x1B[31m"
};
var log = {
  info: (msg) => console.log(`${colors.blue}\u2139${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}\u2713${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}\u26A0${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}\u2715${colors.reset} ${msg}`)
};

// src/helpers/git/get-repo-root.ts
var getRepoRoot = () => {
  try {
    return execSync2("git rev-parse --show-toplevel", {
      encoding: "utf-8"
    }).trim();
  } catch (err) {
    log.error("Not a Git repository. Please run this inside a Git project.");
    process.exit(1);
  }
};

// src/helpers/git/get-line-ownership.ts
async function getLineOwnership(contributors) {
  const repoRoot = getRepoRoot();
  const blameOutput = execSync3(
    `git -C "${repoRoot}" ls-tree -r -z --name-only HEAD | while IFS= read -r -d '' file; do git -C "${repoRoot}" blame --line-porcelain "$file" | grep  -a '^author '; done | sort | uniq -c | sort -nr`,
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

// src/helpers/json-to-csv.ts
function jsonToCsv(json) {
  const { t, b } = json;
  let csv = `${t},`;
  b.forEach(({ n, co }) => {
    let branchCsv = `b-${n},`;
    co.forEach(({ n: n2, e, c, o, loc, rm }) => {
      let commitDates = "";
      Object.entries(c.cph).map(([hour, value]) => {
        commitDates += `|${value}`;
      });
      Object.entries(c.cpm).map(([month, value]) => {
        commitDates += `|${value}`;
      });
      commitDates += `|${c.f}~${c.l}`;
      branchCsv += `|${n2},${e},${o},${loc},${rm},${commitDates}`;
    });
    csv += `|${branchCsv}`;
  });
  return csv;
}

// src/index.ts
var git = simpleGit();
var getGitStats = async () => {
  log.info("Starting Git analysis...");
  const repoName = await getRepoName();
  const branches = args_default.currentBranchOnly ? await getCurrentBranch() : await getAllBranches();
  const currentBranch = (await git.branchLocal(['--format="%(refname:short)"'])).current;
  const branchData = [];
  for (const branch of branches) {
    await git.checkout(branch);
    const contributors = await getContributors();
    if (args_default.getOwnership) {
      await getLineOwnership(contributors);
    }
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
  const csv = jsonToCsv(data);
  const compressedCsv = LZString.compressToEncodedURIComponent(csv);
  log.success("Git analysis completed successfully.");
  log.info("Opening visualization in browser...");
  const clientUrl = process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://git-viz.netlify.app";
  const url = `${clientUrl}/stats/?q=${compressedCsv}`;
  console.log("CSV COMPRESSED: ", compressedCsv.length);
  await open(url);
  log.success("Done!");
  return data;
};
getGitStats();
export {
  getGitStats,
  git
};
