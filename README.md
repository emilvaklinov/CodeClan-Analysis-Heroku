# CodeClan Collaborative Project - Tweet analysis app

We’ve been approached by an organisation that would like the ability to find out tweet frequency or sentiment by location. We will build a Minimum Viable Product that will retrieve data from Twitter and display it to the user, then explore ways to analyze and display meaningful data in an interesting way.

***

## MVP 

* Be able to fetch tweets from the Twitter API   
* Be able to filter the data retrieved from the API   
* Be able to display filtered API data on the front end   
* Be able to persist user input from the front end into the database   
* Be able to retrieve data from the database   
* Be able to display the data from the database on the front end   
* Practice PubSub and MVC design patterns   
   
## Possible Extensions
   
* Implement a mapping library with basic functionality (points on map)   
* Try to use the map library to display heatmaps of tweet data by geolocation (dependant on the usefulness of the data retrieved)   
* Explore other libraries for analysing twitter data (i.e tweet sentiment, gender analysis)   
* Display the analysis on the front end   
* Explore chart libraries to find other interesting ways to display data on the front end   
   
## The team

Emil Vaklinov   
Marcin Jerwan   
Raphael Ugha   
Vicky Jackson   

***

## Setup dev environment

Our project makes use of the node modules [Twit](https://www.npmjs.com/package/twit) and [Geocoder](https://www.npmjs.com/package/node-geocoder). To run the project in a dev environment, you must set the environment variables for those libraries in your .bashrc file. If you use plain bash, update the .bashrc file in your home directory; if you use zsh, update the .zshrc file in your home directory.

Open the relevant file and paste the following:

```
export GROUP_PROJECT_TWITTER_CONSUMER_KEY=???
export GROUP_PROJECT_TWITTER_CONSUMER_SECRET_KEY=???
export GROUP_PROJECT_GEOCODER_CONSUMER_KEY=???
```

Ask one of us for the keys, and replace the question marks with them. Remember to save the file!

Close and reopen any tabs that were running the node server, then check it worked by running:

```
set
```
