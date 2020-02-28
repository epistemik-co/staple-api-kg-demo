const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const staple = require("staple-api");

const ontology = {
    file: "./ontology.ttl" 
};

const config = {
    type: "mongodb",
    url: "mongodb://127.0.0.1:27017", 
    dbName: "staple",
    collectionName: "staple",
};

// let config = {
//     type: "sparql",
//     url: "http://dbpedia.org/sparql", 
//     updateUrl: "http://dbpedia.org/sparql",
//     graphName: "http://dbpedia.org"
// };

// const config = {
//     type: "mongodb",
//     url: "mongodb+srv://guest:guest@cluster0-ek2ca.mongodb.net/test", 
//     dbName: "staple",
//     collectionName: "staple",
// };

async function Demo() {
    
    const app = express();
    app.use(express.static("web"))
    
    const stapleApi = await staple(ontology, config);
    const schema = stapleApi.schema

    let people = []
    console.log("Fetching all people")
    await stapleApi.graphql('{ Person { _id label } }').then((response) => {
        people = response.data.Person;
        });

    app.get('/people', function (req, res) {
        res.send(people)
      })

    const path = "/graphql"
    const server = new ApolloServer({
        schema
    });

    app.listen({ port: 4000 }, () =>
        console.log("🚀 Server ready")
    );
    
    server.applyMiddleware({ app, path });
}

Demo()
