const admin = require('firebase-admin')
const serviceAccount = require('../../credentials.json');

let db;

function connectFirestore() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
    db = admin.firestore()
}

exports.getMemes = (req, res) => {
    if (!db) {
        connectFirestore()
    }
    db.collection('catmeme1').get()
        .then(collection => {
            const memes = collection.docs.map(doc => {
                return doc.data()
            })
            res.send(memes)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send(err)
        })

}
exports.createMeme = (req, res) => {
    // check if valid request, otherwise send error
    if (!req.body || !req.body.imageURL || !req.body.title || !req.body.creator) {
        res.status(400).send('Invalid request')
    }
    if (!db) {
        connectFirestore()
    }
    db.collection('catmeme1').add(req.body)
        .then(() => res.status(201).send("created"))
        .catch(err => {
            console.log('Error creating meme: ', err.message)
            res.status(500).send(err)
            // })
            // return "created"
            // catch and return error
        })
}

exports.updateMeme = (req,res) => {
    // to change data for a specific meme...
    //we need to know:
    // 1. what meme we want to change (req.params.memeId)
    // 2. the new data(req.body)
    if(!req.body || !req.params.memeId){
        res.status(401).send('Invalid request')
    }
    // connect to database
    if (!db) {
        connectFirestore()
    }
    // update specific doc
    db.collection('catmeme1').doc(req.params.memeId).update(req.body)
    // if ok, respond: "updated"
    .then(() => res.status(202).send("updated"))
    // if error: respond with error
    .catch(err => {
        console.log ('Error updateing meme: ', err.message)
        res.status(500).send(err)
    })
}

exports.deleteMeme = (req,res) => {
    if(!req.params.memeId) {
        res.status(401).send('Invalid request')
    }
    if (!db) {
        connectFirestore()
        db.collection('catmeme1').doc(req.params.memeId).delete()
        .then(() => res.status(203).send("deleted"))
        .catch(err =>{
            console.log('Error deleting meme: '), err.message
            res.status(500).send(err)
        })
    }
}