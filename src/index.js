#!/usr/bin/env node

import open from 'open';

const searchEngines = {
  google: 'https://www.google.com/search?q=',
  twitter: 'https://twitter.com/search?src=typd&q=%23',
  reddit: 'https://www.reddit.com/search?q=',
};

/**
 * prints the usage and optional an error
 * @param  {string} err the error to print
 * @return {void}
 */
function printUsage(err) {
  if (err) {
    console.error('ERROR:', err);
  }
  console.log('USAGE:');
  console.log(' web-s [provider] <searchstring>');
  console.log(' WHERE');
  console.log('  <searchstring> is the string to search for');
  console.log('  [provider] is one of the following(default is google):');
  console.log('  -r --reddit');
  console.log('  -t --twitter');
}

function parseArguments(args) {
  switch (args[0]) {
    case '-h':
    case '--help': printUsage(); break;
    case '-r':
    case '--reddit': open(searchEngines.reddit + args.slice(1).join(' ')); break;
    case '-t':
    case '--twitter': open(searchEngines.twitter + args[1]); break;
    default: open(searchEngines.google + args.join(' '));
  }
}


if (process.argv.length >= 3) {
  parseArguments(process.argv.slice(2));
} else {
  printUsage('No searchstring');
}
