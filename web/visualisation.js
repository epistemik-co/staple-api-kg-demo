var nodes, edges, network;

var uris = {}

const countryRels = {
    birthCountry: "country of birth",
    deathCountry: "country of death",
    both: "country of birth & death"
}

var instructionText = 'Use the searchbox to <b>find people by names</b>. Click on nodes to <b>find related entities</b>. Double-click to <b>go to Wikipedia</b>.'

function getWikipedia(uri) {
    return uri.replace("http://dbpedia.org/resource/", "https://en.wikipedia.org/wiki/")
}

function getDBpedia(uri) {
    return uri.replace("https://en.wikipedia.org/wiki/", "http://dbpedia.org/resource/")
}

function getUri(label) {
    return uris[label]
}

function start() {
    let names_box = $('#names_box');

    fetch("/people", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
        .then(r => r.json())
        .then(data => {
            console.log("fetched names")
            data.forEach(item => {
                names_box.append($('<option>').attr('value', decodeURI(item.label)));
                uris[decodeURI(item.label)] = item._id
            });
        });
}

function instruction() {
    setTimeout(function () { document.getElementById('statement').innerHTML = instructionText }, 1000);
};

function visualise(parent, relation, entity) {

    if (nodes.get(entity._id) == null) {

        var node = {
            id: entity._id,
            uri: entity._id,
            next: 0,
            mass: 2.5,
        }

        if (parent != null) {
            node.x = network.getPositions(parent)[parent].x;
            node.y = network.getPositions(parent)[parent].y;
        }


        if (entity._type[0] == "Country") {
            node.shape = 'image'
            node.image = "https://image.flaticon.com/icons/svg/664/664577.svg"
            node.size = 60
            node.label = entity.label
            node.type = "country"
        } else if (entity._type[0] == "Person") {
            node.size = 40
            node.type = "person"
            if (entity.thumbnail != null) {
                node.image = entity.thumbnail
                node.shape = 'circularImage'
                node.brokenImage = "https://image.flaticon.com/icons/svg/149/149071.svg"
            } else if (entity.gender == "female") {
                node.image = "https://image.flaticon.com/icons/svg/201/201634.svg"
                node.shape = 'circularImage'
            } else if (entity.gender == "male") {
                node.image = "https://image.flaticon.com/icons/svg/145/145843.svg"
                node.shape = 'circularImage'
            } else {
                node.image = "https://image.flaticon.com/icons/svg/149/149071.svg"
                node.shape = 'circularImage'
            }


            var year = ""
            if (entity.birthYear != null || entity.deathYear != null) {
                year = "\n"
                if (entity.birthYear != null) {
                    year = year + String(entity.birthYear)
                }
                year = year + " - "
                if (entity.deathYear != null) {
                    year = year + String(entity.deathYear)
                }
            }

            var description = ""
            if (entity.description != null) {
                description = entity.description + "<br><br>"
            }

            node.label = decodeURI(entity.label) + year
            node.title = description + '<b>See:</b> ' + getWikipedia(entity._id)

        }

        try {
            nodes.add(node);
        }
        catch (err) { console.log("Error when visualising node: " + JSON.stringify(node)) };
    }

    if (parent != null && relation != null) {
        var edge = {}
        if (relation == "child") {
            edge = {
                id: parent + "_child_" + entity._id,
                from: parent,
                to: entity._id,
                label: "parent of",
                arrows: {
                    to: true
                }
            }
        }
        if (relation == "parent") {
            edge = {
                id: entity._id + "_child_" + parent,
                from: entity._id,
                to: parent,
                label: "parent of",
                arrows: {
                    to: true
                }
            }
        }
        if (relation == "spouse") {
            var vertices = [entity._id, parent];
            vertices.sort();
            edge = {
                id: vertices[0] + "_spouse_" + vertices[1],
                from: vertices[0],
                to: vertices[1],
                label: "spouse of",
                arrows: {
                    from: true,
                    to: true
                }
            }
        }
        if (relation == "birthCountry" || relation == "deathCountry") {
            var edgeId = parent + "_country_" + entity._id;
            if (edges.get(edgeId) != null) {
                edges.update([{ id: edgeId, label: countryRels.both }]);
            } else {
                edge = {
                    id: edgeId,
                    from: parent,
                    to: entity._id,
                    label: countryRels[relation],
                    arrows: {
                        to: true
                    }
                }
            }
        }
        try {
            edges.add(edge);
        }
        catch (err) { console.log("Error when visualising edge: " + JSON.stringify(entity)) };
    }

    for (var property in entity) {

        if (entity[property] != null && typeof entity[property] === 'object' && entity[property].constructor === Object) {
            visualise(entity._id, property, entity[property])
        }

        if (entity[property] != null && typeof entity[property] === 'object' && entity[property].constructor === Array) {

            entity[property].forEach(value => {


                if (value != null && typeof value === 'object' && value.constructor === Object) {
                    visualise(entity._id, property, value)
                }
            })
        }
    }

}

function init(uri) {
    draw();

    console.log("Searching for: " + uri)

    fetch("/graphql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: `{ Person(filter:{_id: "` + uri + `"}){ _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } } }` })
    })
        .then(r => r.json())
        .then(data => {
            visualise(null, null, data.data.Person[0]);
            instruction();
        });
};


function getRelated(parent) {
    var parentNode = nodes.get(parent);

    if (parentNode.type == "person") {
        // successor { _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } } predecessor { _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } }
        document.getElementById('statement').innerHTML = "Retrieving data. Please wait...";
        var query = `{ Person(filter: { _id:"` + parent + `"}) { _id child { _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } } parent { _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } } spouse { _id _type label description gender thumbnail birthYear deathYear birthCountry { _id _type label } deathCountry { _id _type label } } } }`

        fetch("/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(r => r.json())
            .then(data => {
                visualise(null, null, data.data.Person[0]);
                instruction();
            });
    }

};



//draw()
//
//Initiates and draws the visjs network.


function draw() {
    nodes = new vis.DataSet([]);
    edges = new vis.DataSet([]);

    var container = document.getElementById('network');

    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        interaction: {
            hover: true,
            hoverConnectedEdges: true,
        },
        "edges": {
            "font": { 
                face: 'arial',
                color: '#FFFFFF',
                strokeColor: '#000000'
            },
            "width": 7,
            "length": 20,
            "color": {
                color: '#983131',
                highlight: '#0C4C8C',
                hover: '#0C4C8C'
            }
        },
        "nodes": {
            "font": { 
                face: 'arial',
                color: '#FFFFFF'
            },
            "borderWidth": 10,
            "color": {
                border: '#983131',
                highlight: '#0C4C8C',
                hover: '#0C4C8C'
            }
        },
        "physics": {
            "forceAtlas2Based": {
                "centralGravity": 0.008,
                "springConstant": 0.04,
                "damping": 0.8
            },
            "solver": "forceAtlas2Based",
            "maxVelocity": 10,
            "minVelocity": 1,
            "timestep": 0.4,
        }
    };

    network = new vis.Network(container, data, options);
    network.fit();

    network.on("click", function (params) {
        if (params.nodes[0] != null) {
            getRelated(params.nodes[0]);
        }
    });

    network.on("doubleClick", function (params) {
        if (params.nodes[0] != null) {
            var uri = String(params.nodes[0])
            window.open(getWikipedia(params.nodes[0]));
        }
    });

}

