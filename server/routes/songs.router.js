const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
// const Pool = pg.Pool;

// const pool = new Pool({
//     database: 'music_library', // Name of database
//     host: 'localhost', // Where our database is
//     port: '5432', // the port for your db; 5432 is default for Postgres
//     max: 10, // How many connections (queries) at one time
//     idleTimeoutMillis: 30000 // 30 seconds to try to connect, then cancel query
// })

// Is not required, but is useful for debugging
// pool.on('connect', () => {
//     console.log('PostgreSQL is connected');
// })

// the pool will emit an error on behalf of any idle clients
// pool.on('error', (error) => {
//     console.log('Error in Postgres Pool', error);
// })

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // Grab a value from request url
   // check SQL query text in Postico first!
   let queryText = 'SELECT * FROM "songs";'; //no quotes needed on id param
   // the second array argument is optional
   // and is used when we have sanitized parameters to queryText
   pool.query(queryText).then((result) => {
          console.log('Song with')
       res.send(result.rows)
       }).catch((err) => {
           console.log('Error making query', queryText, err);
           res.sendStatus(500);
       })
});


// router.get('/:id', (req, res) => {
//      // Grab a value from request url
//     const idToGet = req.params.id;
//     // check SQL query text in Postico first!
//     let queryText = 'SELECT * FROM "songs" WHERE id=$1;'; //no quotes needed on id param
//     // the second array argument is optional
//     // and is used when we have sanitized parameters to queryText
//     pool.query(queryText, [idToGet]).then((result) => {
//            console.log('Song with ID', idToGet);
//         res.send(result.rows)
//         }).catch((err) => {
//             console.log('Error making query', idToCheck, queryText, err);
//             res.sendStatus(500);
//         })
// });

router.post('/', (req, res) => {
    const newSong = req.body;
    const queryText = `
    INSERT INTO "songs" ("artist", "track", "published", "rank")
    VALUES ($1, $2, $3, $4);
    `;
    // parameterized query, prevents SQL injection
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank]).then((result) => {
        res.sendStatus(201)
    }). catch((err) => {
    console.log('Error Querying', queryText, err);
        res.sendStatus(500);
    })
});

router.delete('/:id', (req, res) => {
    let reqId = req.params.id;
    console.log('params id', reqId);
    let queryText = 'DELETE FROM "songs" WHERE "id" = $1;';
    pool.query(queryText, [reqId]).then((result) => {
        console.log('Deleted the song');
        res.sendStatus(200);
    }).catch((err) => {
        console.log('There was an error', err);
        res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
    let idToUpdate = req.params.id;
    console.log(req.body);
    console.log(idToUpdate);
    let sqlText = '';
    if(req.body.direction === 'up') {
    sqlText = `
        UPDATE "songs" 
        SET "rank" = "rank" -1 
        WHERE "id" = $1;
        `
    } else if (req.body.direction === 'down') {
    sqlText = `
        UPDATE "songs" 
        SET "rank" = "rank" +1 
        WHERE "id" = $1;
        `
    } else {
        //bad req
        res.sendStatus(400);
        // NOTHING ELSE HAPPENS.
        return;
    }
    let sqlValues = [idToUpdate]
    pool.query(sqlText, sqlValues)
    .then(result => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})




module.exports = router;