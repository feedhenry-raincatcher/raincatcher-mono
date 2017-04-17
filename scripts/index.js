#!/usr/bin/env node
require('yargs')
  .usage('$0 [command] ; Extra commands for managing this repo')
  .command(require('./add-remotes'))
  .command(require('./fetch'))
  .command(require('./pull'))
  .command(require('./push'))
  .command(require('./pr'))
  .help()
  .argv;