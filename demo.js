const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const staple = require("staple-api");

const ontology = {
    file: "./docs/ontology.ttl" 
};

const config = {
    type: "mongodb",
    url: "mongodb+srv://guest:guest@cluster0-ek2ca.mongodb.net/test", 
    dbName: "staple",
    collectionName: "staple",
};

async function Demo() {
    
    const app = express();
    app.use(express.static("docs"))
    
    // creating staple-api wrapped into ApolloServer

    const stapleApi = await staple(ontology, config);
    const schema = stapleApi.schema

    const path = "/graphql"
    const server = new ApolloServer({
        schema
    });

    app.listen({ port: 5000 }, () =>
        console.log("🚀 Server ready")
    );
    
    server.applyMiddleware({ app, path });

    // creating endpoint serving the list of all people and their names for FE indexing

    let people = []

    console.log("Fetching people's names...")
    await stapleApi.graphql('{ Person { _id label } }').then((response) => {
        pips = response.data.Person;
        pips.forEach(element => {
            people.push({id: element._id, text:element.label})
        });
        console.log("All fetched...")
        });

    app.get('/people', function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(people)
      })

    
}

Demo()
