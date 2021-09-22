##### Simple Node.js CLI for saving various forms of 4chan content to disk. WIP

## Usage

After cloning the repo, run `npm install` from the repository root to install all dependenices listed in the package.json file (currently only puppeteer)

### Examples:

Scrape all relevant information from thread, format it as json and save it to disk:  
`node index <valid URL resolving to a 4chan thread> --json`

Using multiple output options (any amount of availiable output options can be combined):  
`node index <valid URL resolving to a 4chan thread> --pdf --images -s`

Running 4scrape with `--all` | `-a` which is shorthand for all available output options  
`node index <valid URL resolving to a 4chan thread> -a`

Running 4scrape with `--help` | `-h` to print the docs:  
`node index -h`

### Full Help Page:

---

##### USAGE:

---

Provide a valid URL which resolves to a 4chan thread as  
first argument.  
Also provide one or more of the output options listed below  
as additional argument(s)

---

##### OUTPUT OPTIONS:

---

`--all` | `-a`          Shorthand for selecting all available options  
`--images` | `-i`       Get all images from thread and save to disk  
`--json` | `-j`         Format thread as json and save to disk  
`--screenshot` | `-s`   Save screenshot of full page to disk  
`--markdown` | `-m`     Format thread as markdown and save to disk  
`--text` | `-t`         Format thread as plain text and save to disk  
`--pdf` | `-p`          Generate pdf from thread and save to disk
