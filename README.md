A Node-CLI to do websearches

## Installation
`sudo npm install -g web-s`

## USAGE
`web-s [provider] <searchstring>`  
provider can be:
* -l / --leo for leo.org search
* -t / --twitter for a twitter search
* -r / --reddit for a reddit search
* -s / --stackoverflow for a stackoverflow search  
__if no provider is given the default provider is google__

`web-s --list` to list all available providers.
`web-s --generate-config` to generate a new config.


this will open your default webbrowser and do a search on the given provider

## Configuration
This tool will place a `.web-s.conf` file in your home directory.
This is a simple text file which will be parsed and used.
You can simply extend this file with more providers as you wish.

## License
MIT
