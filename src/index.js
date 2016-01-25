import open from 'open';
import { sprintf } from 'sprintf-js';

const searchEngines = {
  google: 'https://www.google.com/search?q=%s',
};

function printUsage(err) {
  if (err) {
    console.error('ERROR:', err);
  }
  console.log('web-s searchstring');
}

function parseArguments(args) {
  open(sprintf(searchEngines.google, args[0]));
}


if (process.argv.length >= 3) {
  parseArguments(process.argv.slice(2));
} else {
  printUsage();
}
console.log(process.argv);
