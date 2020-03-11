#  Noble Connections - Staple API demo ![logo](https://raw.githubusercontent.com/epistemik-co/staple-api-kg-demo/master/docs/favicon.ico)

**Noble Connections** is a knowledge graph app demo built using [Staple API](http://staple-api.org) on top of [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 


# Live version

The live version of this demo is deployed at [http://demo.staple-api.org](http://demo.staple-api.org).


# Staple API

The full documentiation of Staple API is available at [http://staple-api.org](http://staple-api.org).


# Running on REPL

1. Go to [https://repl.it/](https://repl.it/). 
2. Press **+ new repl** to create a new Repl environment and choose **Import From GitHub**. 
3. Paste the URL of this repository and import it. 
4. Press the **Run** button and wait for the app to start at the automatically generated URL [https://***--five-nine.repl.co](#). 

The application exposes two graphical interfaces:
- the demo FE at [https://***--five-nine.repl.co](#)
- the Apollo playground of the underlying Staple API at [https://***--five-nine.repl.co/graphql](#), where you can issue GraphQL queries to the remote MongoDB Atlas instance storing the application (knowledge graph) data, e.g.:

```graphql
{
  Person(filter: { _id: "http://dbpedia.org/resource/Elizabeth_II" }) {
    _id
    _type
    label
    spouse {
      _id
      _type
      label
    }
    child {
      _id
      _type
      label
    }
    parent {
      _id
      _type
      label
    }
    birthYear
    deathYear
    birthCountry {
      _id
      _type
      label
    }
    deathCountry {
      _id
      _type
      label
    }
  }
  _CONTEXT {
    _id
    _type
    Person
    Country
    label
    description
    gender
    thumbnail
    birthYear
    deathYear
    birthCountry
    deathCountry
  }
}
```

# Further reading
[Knowledge Graph App in 15min. Prototyping a simple knowledge graph application with JSONs, MongoDB and automatically generated GraphQL API](https://medium.com/@sklarman/c76b94bb53b3), S. Klarman, 2020.
