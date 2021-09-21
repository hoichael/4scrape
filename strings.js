const stringObj = {
  errorTextArgs: ` - Invalid arguments - Exiting Program
 - Make sure to provide a valid URL and at least one ouput option
 - (--help or -h for help)`,

  errorTextURL: ` - Something went wrong - Exiting Program
 - Most likely the provided URL is invalid`,

  initText: " - Scrape started - This may take a while. . . . . . . . . . . ",

  closeText: " - Scrape successfully finished - Exiting Program",

  helpText: `---------------------------------------------------------------
                            USAGE:                            
---------------------------------------------------------------
Provide a valid URL which resolves to a 4chan thread as        
first argument.                                                
Also provide one or more of the output options listed below    
as additional argument(s)                                      
---------------------------------------------------------------
                        OUTPUT OPTIONS:                       
---------------------------------------------------------------
--all | -a        Shorthand for selecting all available options
--images | -i       Get all images from thread and save to disc
--json | -j              Format thread as json and save to disc
--screenshot | -s          Save screenshot of full page to disc
--markdown | -m      Format thread as markdown and save to disc
--text | -t        Format thread as plain text and save to disc
--pdf | -p            Generate pdf from thread and save to disc`,
};

module.exports = { stringObj };
