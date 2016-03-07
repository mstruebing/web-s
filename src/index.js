#!/usr/bin/env node

import open from 'open';
import fs from 'fs';
import readline from 'readline';

const CONFIG_FILE = `${process.env.HOME}/.web-s.conf`;

const initConfig = {
  google: {
    url: 'https://www.google.com/search?q=%HERE%',
    shortHand: 'default',
  },
  twitter: {
    url: 'https://twitter.com/search?src=typd&q=%23%HERE%',
    shortHand: 't',
  },
  reddit: {
    url: 'https://www.reddit.com/search?q=%HERE%',
    shortHand: 'r',
  },
  stackoverflow: {
    url: 'http://stackoverflow.com/search?q=%HERE%',
    shortHand: 's',
  },
  leo: {
    url: 'http://dict.leo.org/ende/index_de.html#/search=%HERE%',
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
 * @return {Boolean}
 */
function openBrowser(provider, args) {
  let url = 0;

  if (provider.shortHand === 'default') {
    url = provider.url.replace('%HERE%', args.join(' '));
  } else {
    url = provider.url.replace('%HERE%', args.slice(1).join(' '));
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


/**
 * checks with provider should be used
 * @param  {Array} args
 * @return {void}
 */
function detetermineProvider(args) {
  let opened = false;
  let defaultProvider = false;

  Object.keys(searchEngines).forEach((provider) => {
    if (`-${searchEngines[provider].shortHand}` === args[0] || `--${provider}` === args[0]) {
      opened = openBrowser(searchEngines[provider], args);
    }
    if (`${searchEngines[provider].shortHand}` === 'default') {
      defaultProvider = provider;
    }
  });

  if (!opened) {
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
  const config = JSON.stringify(initConfig, null, 2);
  fs.writeFile(CONFIG_FILE, config);
}

/**
 * reads the config file
 * @return {Object}
 */
function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

/**
 * checks if a config is valid
 * @param  {Object} searchEngines
 * @return {Boolean}
 */
function configValid() {
  const shortHands = [];
  const providers = [];

  Object.keys(searchEngines).forEach((provider) => {
    shortHands.push(searchEngines[provider].shortHand);
    providers.push(provider);
  });

  return !hasDuplicates(shortHands) && !hasDuplicates(providers);
}

/**
 * Checks if a config has duplicate entries
 * @param  {Array}  array
 * @return {Boolean}
 */
function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}


// TODO: Refactor, global searchEngines?
// break down into more functions?
let searchEngines;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!configExist()) {
  createInitConfig();
  searchEngines = initConfig;
} else {
  searchEngines = readConfig();
  if (configValid()) {
    if (process.argv.length >= 3) {
      parseArguments(process.argv.slice(2));
    } else {
      printUsage('No searchstring');
    }
  } else {
    console.log('There is an error in your config file (~/.web-s.conf)');
    rl.question('Should we create a new one? (Y/N): ', (answer) => {
      if (answer.toUpperCase() === 'Y') {
        createInitConfig();
      }
      rl.close();
    });
  }
}
