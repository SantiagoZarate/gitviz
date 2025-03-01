#!/usr/bin/env node

import { getGitStats } from '@gitviz/cli';

// Execute and log result
getGitStats().then(console.log).catch(console.error);
