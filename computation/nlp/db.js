const OrientDBClient = require("orientjs").OrientDBClient;
// var server = new OrientDBClient({
//     host: 'localhost',
//     port: 2424,
//     username: 'root',
//     password: 'troo',
//     useToken: false
// });
// var db = server.use('circ');
// console.log('Using Database:', db.name);
// module.exports = db;


const clientt = new OrientDBClient({//.connect
    host: "localhost",
    port: 2424
});
module.exports.client = clientt;
module.exports.on = OrientDBClient.connect({//
    host: "localhost",
    port: 2424
});

// .then(client => {
//     client.session({ name: "circ", username: "root", password: "troo" });
//     // .then(pool => {
//     //     return pool.acquire();
//     // });
// });
// use the session
// session.command("insert into V set name = :name", { params: { name: "test" } })
// .all()
// .then(result => {
// console.log(result);


module.exports.off = (client) => {
    return client.close();
};

// (session) => session.close()
//     .then(() => {
//         // close the pool
//         return pool.close();
//     }).then(

// .on('error', (err) => {
//     console.log(err);
//     session.close().then(() => {
//         return client.close;
//     });
// });
// close the session

// });
// });

// module.exports = { on, off };
