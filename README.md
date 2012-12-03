Rally Open Stories, Tasks, and Defects by Iteration
======================

![Title](https://raw.github.com/RallyApps/OpenStoriesTasksAndDefects/master/screenshots/title-screenshot.png)

## Overview

The Open Stories, Defects, and Tasks app displays all open user stories, tasks, defects and test cases in an iteration, where you are the owner.

## How to Use

### Running the App

If you want to start using the app immediately, create an Custom HTML app on your Rally dashboard. Then copy App.html from the deploy folder into the HTML text area. That's it, it should be ready to use. See [this](http://www.rallydev.com/help/use_apps#create) help link if you don't know how to create a dashboard page for Custom HTML apps.

Or you can just click [here](https://raw.github.com/RallyApps/OpenStoriesTasksAndDefects/master/deploy/App.html) to find the file and copy it into the custom HTML app.

### Using the App

You can specify an iteration by using the drop down menu on the top of the app. The app categorizes the items separately: Stories, Defects, and Tasks. You can click on the column headers to sort items in ascending or descending order. You can also click on the item number link to take you to the detail page of the user story, defect, or task item (<b>note:</b> this will not work if you run the app through App-debug.html). 

## Customize this App

You're free to customize this app to your liking (see the License section for details). If you need to add any new Javascript or CSS files, make sure to update config.json so it will be included the next time you build the app.

This app uses the Rally SDK 1.32. The documentation can be found [here](http://developer.rallydev.com/help/app-sdk).

Available Rakefile tasks are:

    rake build                      # Build a deployable app which includes all JavaScript and CSS resources inline
    rake clean                      # Clean all generated output
    rake debug                      # Build a debug version of the app, useful for local development
    rake deploy                     # Deploy an app to a Rally server
    rake deploy:debug               # Deploy a debug app to a Rally server
    rake deploy:info                # Display deploy information
    rake jslint                     # Run jslint on all JavaScript files used by this app, can be enabled by setting ENABLE_JSLINT=true.

## License

OpenStoriesTasksAndDefects is released under the MIT license.  See the file [LICENSE](https://raw.github.com/RallyApps/OpenStoriesTasksAndDefects/master/LICENSE) for the full text.