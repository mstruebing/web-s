#!/usr/bin/env node

import open from 'open';
import fs from 'fs';

const ALL_ARGS = 0;
const ALL_EXCEPT_FIRST_ARG = 1;
const CONFIG_FILE = `${process.env.HOME}/.web-s.conf`;

const sampleConfig = {
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
}

/**
 * joins the arguments dependent on the provider and opens the default webbrowser
 * @param  {object} provider
 * @param  {array} args the cli arguments
 * @return {true}
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

  return true;
}

/**
 * Parses the arguments and invokes the needed functions
 * @param  {Array} args the arguments
 * @return {void}
 */
function parseArguments(args) {
  switch (args[0]) {
    case '--generate-config': generateNewConfig(); break;
    case '--list': listProviders(''); break;
    case '-h':
    case '--help': printUsage(); break;
    default: detetermineProvider(args);
  }
}


function detetermineProvider(args) {
  let opened = false;
  let defaultProvider = false;

  Object.keys(searchEngines).forEach((provider) => {
    console.log(provider);
    if (`-${searchEngines[provider].shortHand}` === args[0] || `--${provider}` === args[0]) {
      opened = openBrowser(searchEngines[provider], args);
    }
    if (`${searchEngines[provider].shortHand}` === 'default') {
      defaultProvider = provider;
    }
  });

  if (!opened) {
    console.log('defaultProvider', defaultProvider);
    openBrowser(searchEngines[defaultProvider], args)
  }
}


/**
 * Generates a new config-file
 * @return {void}
 */
function generateNewConfig() {
  if (configExist()) {
    fs.unlinkSync(CONFIG_FILE);
  }

  createInitConfig();
}


/**
 * checks if a config exists
 * @return {Boolean}
 */
function configExist() {
  let fileExist = false
  try {
    fileExist = fs.statSync(CONFIG_FILE).isFile();
  } finally {
    return fileExist;
  }
}


/**
 * creates a sample config
 * @return {void}
 */
function createInitConfig() {
  const config = JSON.stringify(sampleConfig, null, 2);
  fs.writeFileSync(CONFIG_FILE, config);
}

/**
 * reads the config file
 * @return {Object}
 */
function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}


if (!configExist()) {
  createInitConfig();
}

const searchEngines = readConfig();
if (process.argv.length >= 3) {
  parseArguments(process.argv.slice(2));
} else {
  printUsage('No searchstring');
}
