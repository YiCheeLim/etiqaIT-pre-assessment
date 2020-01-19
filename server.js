const express = require('express')
const fs = require('fs')
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin123@testdb-x8klx.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

app.use( express.static('front_end') );
    
app.get('/', ( req, res ) => {
    if ( Object.keys(User.byEmail).length == 0 ) {
        User.initialise().then(() => {
            res.sendfile('./front_end/main.html');
        });
    } else {
        res.sendfile('./front_end/main.html');
    }
});
app.post('/get-users', ( req, res ) => {
    console.log( User.byEmail );

    res.json( User.byEmail );
});
app.post('/add-user', jsonParser, ( req, res ) => {
    User.add( req.body.username, req.body.phone, req.body.email, req.body.skillsets, req.body.hobby ).then(() => {
        res.json( User.byEmail[req.body.email] );
    });
});
app.post('/update-user', jsonParser, ( req, res ) => {
    User.byEmail[req.body.email].edit( req.body.username, req.body.phone, req.body.email, req.body.skillsets, req.body.hobby ).then(() => {
        res.json( User.byEmail );
    });
});
app.post('/delete-user', jsonParser, ( req, res ) => {
    User.byEmail[req.body.email].delete().then(() => {
        res.json( User.byEmail );
    });
});

app.listen( 80 );
console.log( 'Listening at http://localhost:80' );

const User = class {
    constructor ( aux ) {
        this.username = aux.username;
        this.phone = aux.phone;
        this.email = aux.email;
        this.skillsets = aux.skillsets;
        this.hobby = aux.hobby;
    };

    static initialise () {
        return new Promise (( resolve ) => {
            client.connect( err => {
                const cursor = client.db("Test").collection("User").find();
        
                cursor.each( (err, doc) => {
                    console.log( "doc", doc );
                    if ( doc ) {
                        User.byEmail[ doc.email ] = new User( doc );
                    }
                });

                resolve();
            });
        });
    };
    static add ( username, phone, email, skillsets, hobby ) {
        return new Promise(( resolve ) => {
            let data = {
                username: username,
                phone: phone,
                email: email,
                skillsets: skillsets,
                hobby: hobby
            };
            client.db("Test").collection("User").insertOne( data , ( err, res ) => {
                if ( err ) console.log( err );
                User.byEmail[ email ] = new User( data );

                resolve();
            });
        });
    };

    edit ( username, phone, email, skillsets, hobby ) {
        return new Promise (( resolve ) => {
            let data = {
                username: username,
                phone: phone,
                email: email,
                skillsets: skillsets,
                hobby: hobby
            };
            client.db("Test").collection("User").updateOne( { email: this.email}, { $set: data } , ( err, res ) => {
                if ( err ) console.log( err );
                delete User.byEmail[ this.email ];
                User.byEmail[ email ] = new User( data );
                resolve();
            });
    
        });
    }

    delete () {
        return new Promise (( resolve ) => {
            client.db("Test").collection("User").deleteOne({ email: this.email }, ( err, res ) => {
                if ( err ) console.log( err );
                delete User.byEmail[ this.email ];
                resolve();
            });    
        });
    };
};
User.byEmail = {};