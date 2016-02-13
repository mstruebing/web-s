#!/usr/bin/env node

import open from 'open';

const ALL_ARGS = 0;
const ALL_EXCEPT_FIRST_ARG = 1;

const searchEngines = {
  google: {
    url: 'https://www.google.com/search?q=',
    args: ALL_ARGS,
    shortHand: 'default',
  },
  twitter: {
    url: 'https://twitter.com/search?src=typd&q=%23',
    args: ALL_EXCEPT_FIRST_ARG,
    shortHand: 't',
  },
  reddit: {
    url: 'https://www.reddit.com/search?q=',
    args: ALL_EXCEPT_FIRST_ARG,
    shortHand: 'r',
  },
  stackoverflow: {
    url: 'http://stackoverflow.com/search?q=',
    args: ALL_EXCEPT_FIRST_ARG,
    shortHand: 's',
  },
  leo: {
    url: 'http://dict.leo.org/ende/index_de.html#/search=',
    args: ALL_EXCEPT_FIRST_ARG,
    shortHand: 'l',
  },
};

/**
 * list all available providers
 * @param  {String} space the space in front of the output
 * @return {void}
 */
function listProviders(space) {
  Object.keys(searchEngines)
    .map(provider => (
        searchEngines[provider].shortHand === 'default'
        ? `${space}${provider} (default)`
        : `${space}${provider}: -${searchEngines[provider].shortHand}/--${provider}`
      ))
    .forEach(line => console.log(line));
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

  // return with exit status 1 if an error occured
  if (err) {
    process.exit(1);
  }
}

/**
 * joins the arguments dependent on the provider and opens the default webbrowser
 * @param  {object} provider
 * @param  {array} args the cli arguments
 * @return {void}
 */
function openBrowser(provider, args) {
  let url = 0;

  if (provider.args === ALL_ARGS) {
    url = provider.url + args.join(' ');
  } else if (provider.args === ALL_EXCEPT_FIRST_ARG) {
    url = provider.url + args.slice(1).join(' ');
  }

  if (url) {
    open(url);
  }
}

/**
 * Parses the arguments and invokes the needed functions
 * @param  {Array} args the arguments
 * @return {void}
 */
function parseArguments(args) {
  switch (args[0]) {
    case '--list': listProviders(''); break;
    case '-h':
    case '--help': printUsage(); break;
    case '-l':
    case '--leo': openBrowser(searchEngines.leo, args); break;
    case '-r':
    case '--reddit': openBrowser(searchEngines.reddit, args); break;
    case '-s':
    case '--stackoverflow': openBrowser(searchEngines.stackoverflow, args); break;
    case '-t':
    case '--twitter': openBrowser(searchEngines.twitter, args); break;
    default: openBrowser(searchEngines.google, args);
  }
}

if (process.argv.length >= 3) {
  parseArguments(process.argv.slice(2));
} else {
  printUsage('No searchstring');
}
