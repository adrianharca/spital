// intending to move some functionality from index.js
const utils = require('util');
var PythonShell = require('python-shell').PythonShell;
var db = require('./db');
const fs = require('fs');
var errr = function (err) {
    if (err) {
        console.error(err);
    }

    console.log('finished');
};
var nodes = [];
var varz = [];
var ids = [];
var ws = [];
var allwds = [];
var pyres = [];

const pyGotResult = function (message) {
    var msj = JSON.parse(message);
    if (msj.result != null && msj.result != undefined) {
        console.log('eureka');
        pyres = JSON.parse(msj.result);
        // console.log('result of py:', pyres[0]);
        return pyres;
    }
    else {
        console.log(msj);
    }
};
async function openConncection(nodes) {
    db.on
        .then(client => {
            client.sessions({ name: "circ", username: "root", password: "troo" });
        })
        .then((pool) => {
            splitsertBatch(pool);
            return pool.acquire()
                .then(session => nodeinsert(nodes, session))
                .catch(errr)
                .then((pool) => { return pool.acquire(); });
        });
}
function insertDataset() {
    fs.readFile('.\\mypy\\corpus\\results\\matrix.txt', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            allwds = Array.from(JSON.parse(jsonString));
            console.log(allwds[0]);
            db.on
                .then(client => {
                    client.sessions({ name: "circ", username: "root", password: "troo" })
                        .then(
                            // (pool) => {
                            // pool.acquire()
                            //     .then(
                            batchsertNodesFirst, errr).catch(errr);

                    // });

                })
                //         .then(() => {
                //             // close the pool
                //             return pool.close();
                //         });
                // })
                // .then(() => {
                //     return client.close();
                // }).then(() => {
                //     console.log('Client closed');
                // })
                .catch(err => console.log(err));
            // client.sessions({ name: "circ", username: "root", password: "troo" })
            // .then(splitsertBatch)


            // .then(() => {
            //     console.log(ids);
            //     nodes.push(ids);
            //     var pyshell3 = new PythonShell('./mypy/script.py');
            //     pyshell3.send(JSON.stringify(nodes));
            //     pyshell3.on('message', function (message) {
            //         var msj = JSON.parse(message);
            //         if (msj.result != null && msj.result != undefined) {
            //             console.log('eureka');
            //             pyres = JSON.parse(msj.result);
            //             console.log('result of py:', pyres[0]);
            //         }
            //     });
            // }).catch(errr);

            // .then(client.close())

            // });
            // .then(db.off);
            // allwds = Array.from(ws);
            // nodes.push(ws);

        } catch (errr) {
            console.log('Error parsing JSON string:', errr);
        }
    });
}
async function closeConnection(pool) {
    // close the pool
    return pool.close()
        .then(() => {

            return client.close();
        }).then(() => {
            console.log('Client closed');

            // }).catch(err => console.log(err));
            // });
        }).catch(err => console.error(err));
}

async function batchsertNodesFirst(pool) {
    let ws = Array.from(allwds);
    nodes.push(allwds);
    var todo = `begin; `;
    console.log('ws len in wordinsert:', ws.length);
    for (var i = 0; i < ws.length; i++) {
        // console.log('i=', i);
        todo = todo.concat(`let $n`, i, `=insert into meet set keywords = "`, ws[i], `"; `);
        varz.push('$n' + i);//+ '.@rid'
    }
    todo = todo.concat(` commit; return [`, varz.toString(), `] ;  `);
    console.log(todo.slice(0, 100));
    // nodes.push(varz);
    await pool.acquire()
        .then(async (session) => {
            return await perfomInsert(session, todo).catch(errr);

        }).catch(errr);

    return splitsertEdges(pool).catch(errr);
    // return closeConnection(pool).catch(errr);


}
async function nodeinsert(nodes, session) {
    let ws = nodes[0];
    var todo = `begin; `;
    console.log('ws len in wordinsert:', ws.length);
    for (var i = 0; i < ws.length; i++) {
        // console.log('i=', i);
        todo = todo.concat(`let $n`, i, `=insert into meet set keywords = "`, ws[i], `"; `);
        varz.push('$n' + i);//+ '.@rid'
    }
    console.log(todo.slice(0, 20));
    nodes.push(varz);
    return pyDist(nodes, todo, session).catch(errr);

    // todo = todo.concat(` commit; return [`, varz.toString(), `] ;  `);
    // console.log(todo);
    // async function gotRes(res) { let nop = await gotNodeIds(res); return session.close; }


    // return session.close();

}


async function pyDist(nodes, todo, session) {
    // console.log(nodes[0][0], 'lol', nodes[1][0]);
    var pyshell3 = new PythonShell('./mypy/script.py');

    pyshell3.send(JSON.stringify(nodes));
    pyshell3.on('message', function (message) {
        var msj = JSON.parse(message);
        if (msj.result != null && msj.result != undefined) {
            console.log('eureka');
            pyres = JSON.parse(msj.result);
            console.log('result of py:', pyres[0]);
            for (var i = 0; i < pyres.length; i++) {
                // console.log('i=', i);
                todo = todo.concat(` create edge SemanticGroup from `, pyres[i][0], ` to `, pyres[i][1], ` set dist=`, pyres[i][2], `; `);//`let $n`, i, `=
                // console.log(todo);
                // varz.push('$n' + i);//+ '.@rid'
            }
            todo = todo.concat(` commit; return [`, varz.toString(), `] ;  `);
            // console.log(todo);
            return perfomInsert(session, todo).catch(errr);

        }
        // console.log(message);
        // return todo;
    });

    pyshell3.on('error', errr);
    pyshell3.end(errr);

}


async function edgeinsert(session, k, kf) {
    // let pyres = await nodeinsert();
    var todo = `begin; `;
    for (var i = k; i < kf; i++) {
        // console.log('i=', i);
        todo = todo.concat(`create edge SemanticGroup from `, pyres[i][0], ` to `, pyres[i][1], ` set dist=`, pyres[i][2], `; `); //`let $n`, i, `=
    }
    todo = todo.concat(`commit;return 2; `);
    // edgeInsertScript.concat(todo);
    console.log(todo.slice(0, 200));
    await session.batch(todo).all()
        .then((r) => { })
        .catch(errr);
    return session.close();
}
async function splitsertEdges(pool) {
    var k = 0;
    var kf = 300;
    console.log('inserting edges:', pyres[0][0]);
    return pool.acquire()
        .then(async (session) => {
            while (kf < pyres.length) {
                session = await edgeinsert(session, k, kf)
                    .then(() => {
                        k = kf;
                        kf = ((k + 300) > pyres.length) ? pyres.length : k + 300;
                        // console.log('k=', k, 'kf=', kf);
                        return pool.acquire();
                    }).catch(errr);
            }
            console.log('done insert edges');
        })
        .then(() => closeConnection(pool)).catch(errr);
}
async function perfomInsert(session, todo) {
    console.log('performing insert');
    await session.batch(todo)
        .all()
        .then(gotNodeIds).catch(errr);
    return session.close();
}

async function gotNodeIds(res) {

    var arr = Array.from(res);
    arr.forEach(a => {
        for (var q in a) {
            var rids = Array.from(a[q]);
            ids.push(rids);
        }
        // return ids;
    });
    console.log('js node ids:', ids.slice(0, 5));
    nodes.push(ids);

    var pyshell3 = new PythonShell('./mypy/script.py');
    const sendAsync = utils.promisify(pyshell3.send.bind(pyshell3));
    const onMessageAsync = utils.promisify(pyshell3.on.bind(pyshell3));
    const endAsync = utils.promisify(pyshell3.end.bind(pyshell3));
    await new Promise((resolve, reject) => {
        // pyshell3.send(JSON.stringify(nodes));
        sendAsync(JSON.stringify(nodes)).catch(errr);
        // console.log('nodes:', nodes[0][0], nodes[1][0]);
        // pyshell3.on('message', pyGotResult);
        onMessageAsync('message', pyGotResult).catch(errr);
        // pyshell3.on('error', reject);
        onMessageAsync('error', errr).then(reject).catch(errr);
        // pyshell3.end(resolve);
        endAsync(resolve).catch(errr);
        // }
        // const asyncpyshelll = utils.promisify(pyshell3);
    }).then(errr)
        .catch(errr);

    // await asyncpyshelll.then(errr)
    //     .catch(errr);
    console.log(pyres.slice(0, 3));
    return pyres;
}
// dis b a function for splitserting that doesnt add orient id to model file.
// ofcourse in case of sqlids we might not need to do separate ops for inserting nodes and edges so i'll leave this here
// make sure to edit gotnodeids to not call pydist on complete if u decide to use this
async function splitsertBatch(pool) {
    var k = 0;
    var kf = 100;
    console.log('words:', allwds[0]);
    ws = Array.from(allwds.slice(k, kf));
    nodes.push(ws);
    console.log('inserting ', ws.length, 'nodes');
    return pool.acquire()
        .then(async (session) => {
            while (ws.length != 0) {
                console.log('inserting ', ws[0]);
                session = await nodeinsert(nodes, session).then(() => {
                    k = kf;
                    kf = ((k + 100) > allwds.length) ? allwds.length : k + 100;
                    ws = k === kf ? [] : allwds.slice(k, kf);
                    console.log('k=', k, 'kf=', kf);
                    nodes = [];
                    nodes.push(ws); return pool.acquire();
                });

            }
            console.log('done insert', ws.length);
        })
        .then(() => closeConnection(pool)).catch(errr);
    // return pool;
    // })
    // .then((pool) => closeConnection(pool)).catch(errr);
}
module.exports = insertDataset;

