# Noble Connections - Staple API demo

**Noble Connections** is a knowledge graph app demo built using [Staple API](http://staple-api.org) on top of MongoDB. 


# Live version

The live version of this demo is deployed at [http://demo.staple-api.org](http://demo.staple-api.org).


# Staple API

The full documentiation of Staple API is available at [http://staple-api.org](http://staple-api.org).


# Running on REPL

1. Go to [https://repl.it/](https://repl.it/). 
2. Press **+ new repl** to create a new Repl environment and choose **Import From GitHub**. 
3. Paste the URL of this repository and import it. 
4. Replace the first line of `docs/visualisation.js` (i.e.: `var apiUri = "http://playground.staple-api.org:5000"`) with `var apiUri = ""`.
5. Press the **Run** button and wait for the app to start at the automatically generated URL [https://***--five-nine.repl.co](#). 

The application exposes two graphical interfaces:
- the demo FE at [https://***--five-nine.repl.co](#)
- the Apollo playground of the underlying Staple API at [https://***--five-nine.repl.co/graphql](#), where you can issue GraphQL queries to the remote MongoDB Atlas instance storing the presented data.
