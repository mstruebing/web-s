#!/usr/bin/env node

import open from 'open';

const searchEngines = {
  google: 'https://www.google.com/search?q=',
  twitter: 'https://twitter.com/search?src=typd&q=%23',
  reddit: 'https://www.reddit.com/search?q=',
  stackoverflow: 'http://stackoverflow.com/search?q=',
};

/**
 * list all available providers
 * @param  {String} space the space in front of the output
 * @return {void}
 */
function listProviders(space) {
  for (const provider in searchEngines) {
    if (provider !== 'google') {
      console.log(`${space}${provider}: -${provider.substr(0, 1)}/--${provider}`);
    } else {
      console.log(`${space}${provider} (default)`);
    }
  }
}

/**
 * prints the usage and optional an error
 * @param  {string} err the error to print
 * @return {void}
 */
function printUsage(err) {
  if (err) {
    console.error('ERROR:', err);
  }
  console.log('USAGE: web-s [provider] <searchstring>');
  console.log('Available providers:');
  listProviders('  ');
}

/**
 * Parses the arguments and invokes the needed functions
 * @param  {Array} args the arguments
 * @return {void}
 */
function parseArguments(args) {
  switch (args[0]) {
    case '-l':
    case '--list': listProviders(''); break;
    case '-h':
    case '--help': printUsage(); break;
    case '-r':
    case '--reddit': open(searchEngines.reddit + args.slice(1).join(' ')); break;
    case '-s':
    case '--stackoverflow': open(searchEngines.stackoverflow + args.slice(1).join(' ')); break;
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
