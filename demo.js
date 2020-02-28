const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const staple = require("staple-api");

const ontology = {
    string: `
      @prefix dbo: <http://dbpedia.org/ontology/> .
      @prefix foaf: <http://xmlns.com/foaf/0.1/> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix owl: <http://www.w3.org/2002/07/owl#> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      @prefix dct: <http://purl.org/dc/terms/> .
      @prefix schema: <http://schema.org/> .


      # classes (-> GraphQL types )

      owl:Thing a rdfs:Class ;
          rdfs:comment "Anything" .

      dbo:Country a rdfs:Class ;
          rdfs:comment "A country" ;
          rdfs:subClassOf owl:Thing .

      dbo:Person a rdfs:Class ;
          rdfs:comment "A person" ;
          rdfs:subClassOf owl:Thing .

      # properties ( -> GraphQL fields )

      rdfs:label a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "Name of the entity" ;
          schema:domainIncludes owl:Thing ;
          schema:rangeIncludes xsd:string .

      dct:description a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "Description of an entity" ;
          schema:domainIncludes owl:Thing ;
          schema:rangeIncludes xsd:string .

      dct:empty a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "dummy property on Country" ;
          schema:domainIncludes dbo:Country ;
          schema:rangeIncludes xsd:string .

      dbo:thumbnail a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "Thumbnail URL" ;
          schema:domainIncludes owl:Thing ;
          schema:rangeIncludes xsd:string .


      dbo:birthYear a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "The year of birth" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes xsd:integer .

      dbo:deathYear a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "The year of death" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes xsd:integer .

      dbo:predecessor a rdf:Property ;
          rdfs:comment "A predecessor of a person in some formal role" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Person .

      dbo:successor a rdf:Property ;
          rdfs:comment "A successor of a person in some formal role" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Person .

      dbo:spouse a rdf:Property ;
          rdfs:comment "A spouse of a person" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Person .

      dbo:child a rdf:Property ;
          rdfs:comment "A child of a person" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Person .

      dbo:parent a rdf:Property ;
          rdfs:comment "A parent of a person" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Person .

      dbo:birthCountry a rdf:Property ;
          rdfs:comment "The country of birth" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Country .

      dbo:deathCountry a rdf:Property ;
          rdfs:comment "The country of death" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes dbo:Country .

      foaf:gender a rdf:Property, owl:FunctionalProperty ;
          rdfs:comment "Gender of a person" ;
          schema:domainIncludes dbo:Person ;
          schema:rangeIncludes xsd:string .
    `
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

async function StapleDemo() {
    
    const app = express();
    app.use(express.static("web"))
    
    const stapleApi = await staple(ontology, config);
    const schema = stapleApi.schema

    const path = "/graphql"
    const server = new ApolloServer({
        schema
    });

    app.listen({ port: 4000 }, () =>
        console.log("🚀 Server ready")
    );
    

    server.applyMiddleware({ app, path });
}

StapleDemo()
