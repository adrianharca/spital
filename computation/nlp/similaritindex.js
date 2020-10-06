// const natural = require('natural');
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const exphbs = require('express-handlebars');
// const wordnet = new natural.WordNet();
// const app = express();
const utils = require('util');
var PythonShell = require('python-shell').PythonShell;
var db = require('./db');
const fs = require('fs');
// const { isNullOrUndefined } = require('util');
// const { response } = require('express');

// // Handlebars
// app.engine('handlebars', exphbs({ defaultLayout: 'landing' }));
// app.set('view engine', 'handlebars');
// // Body Parser
// app.use(bodyParser.urlencoded({ extended: false }));
// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));
// // Index route
// app.get('/', (req, res) => res.render('base', { layout: 'landing' }));
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server started on port ${PORT}`));
// app.get('/search', (req, res) => {
//     let { term } = req.query;

//     // Make lowercase
//     term = term.toLowerCase();

//     wordnet.lookup(term, function (details) {
//         details.forEach(o => {
//             console.log("Definition: " + o.def);
//             console.log("Synonyms: " + o.synonyms);
//             console.log("Full obj:");
//             scrollThru(o);

//         });
//         return details[0];
//     });

//     wordnet.synset_from_pos_and_offset(result.pos, result.synsetOffset);
//     // .then(result =>
//     //     wordnet.synset_from_pos_and_offset(result.pos, result.synsetOffset)
//     // );


// });
function scrollThru(a) {
    Object.keys(a).forEach((k, i) => console.log(k + ' ' + a[k]));

}
var errr = function (err) {
    if (err) {
        console.error(err);
    }

    console.log('finished');
};
// var myPythonScriptPath2 = './py/test.py';

// Use python shell


var w1 = ['politics', 'obama', 'go'];
var w2 = ['sport', 'olympics', 'watch'];
var w3 = ['world', 'feminist', 'literature'];
// var ws = [w1, w2, w3];
// var batch = ``;
// for (var w in ws) {
//     batch.append(`insert into circ set name = w[0];`);
// }
var nodes = [];
var varz = [];
var ids = [];
var ws = [];
var allwds = [];

var pyres = [];
var edgeInsertScript = '';
const pyGotResult = function (message) {
    var msj = JSON.parse(message);
    if (msj.result != null && msj.result != undefined) {
        console.log('eureka ', msj.result);

        pyres = JSON.parse(msj.result);
        // console.log('result of py:', pyres[0]);
        return pyres;
    }
    else {
        console.log(msj);
    }
};



async function gotNodeIds(res) {

    var arr = Array.from(res);
    arr.forEach(a => {
        for (var q in a) {
            var rids = Array.from(a[q]);
            ids.push(rids);
        }
        return ids;
    });
    // following code is for inserting 
    // console.log('node ids:', ids.slice(0, 5));
    // nodes.push(ids);

    // var pyshell3 = new PythonShell('./mypy/script.py');
    // const sendAsync = utils.promisify(pyshell3.send.bind(pyshell3));
    // const onMessageAsync = utils.promisify(pyshell3.on.bind(pyshell3));
    // const endAsync = utils.promisify(pyshell3.end.bind(pyshell3));
    // await new Promise((resolve, reject) => {
    //     // pyshell3.send(JSON.stringify(nodes));
    //     sendAsync(JSON.stringify(nodes)).catch(errr);
    //     // console.log('nodes:', nodes[0][0], nodes[1][0]);
    //     // pyshell3.on('message', pyGotResult);
    //     onMessageAsync('message', pyGotResult).catch(errr);
    //     // pyshell3.on('error', reject);
    //     onMessageAsync('error', errr).then(reject).catch(errr);
    //     // pyshell3.end(resolve);
    //     endAsync(resolve).catch(errr);
    //     // }
    //     // const asyncpyshelll = utils.promisify(pyshell3);
    // }).then(errr)
    //     .catch(errr);

    // // await asyncpyshelll.then(errr)
    // //     .catch(errr);
    // return pyres;
}
async function perfomInsert(session, todo) {
    console.log('performing insert');
    await session.batch(todo)
        .all()
        .then(gotNodeIds).catch(errr);
    return session.close();
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

async function pyOne(nodes) {
    var pyshell3 = new PythonShell('./mypy/add1.py');
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
    console.log(pyres.slice(0, 3));
    return pyres;
}
// var pyshell3 = new PythonShell('./mypy/script.py');


async function doRepeat(pool, nodes) {
    return pool.acquire()
        .then(session => nodeinsert(nodes, session)).catch(errr)
        .then(() => { return pool.acquire(); });
}

// .then(edgeinsert)
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


async function doOnce(nodes) {
    db.on
        .then(client => {
            client.sessions({ name: "circ", username: "root", password: "troo" })
                .then(pool => {
                    return pool.acquire()
                        .then(session => nodeinsert(nodes, session)).catch(errr)
                        // .then(() => { return pool.acquire(); })
                        // .then(edgeinsert)
                        .then(() => {
                            // close the pool
                            return pool.close();
                        });
                })
                .then(() => {
                    return client.close();
                }).then(() => {
                    console.log('Client closed');
                }).catch(err => console.log(err));
            // });
        }).catch(err => console.error(err));
}

//TODO:modify to reflect different datatypes and select by sqlid(use Indata)
async function getRelated(ids, enttype = 'meet') {
    let q1 = "SELECT * FROM (MATCH { class= :cls, as: m, where: (id = :idds or @rid = :idds or @rid= ('#'+:idds) ) }.outE('SemanticGroup'){ as: e, where: (dist < 10.0) }.inV(){ as: mm, while: ($depth < 2), where: ($matched != $currentMatch) } RETURN mm, e.dist, mm.keywords order by e.dist)";
    let pq1 = { params: { cls: enttype, idds: ids } };
    db.on
        .then(client => {
            client.sessions({ name: "circ", username: "root", password: "troo" })
                .then(pool => {
                    return pool.acquire()
                        .then(session => session
                            .query("SELECT * FROM (MATCH { class= :cls, as: m, where: (id = :idds or @rid = :idds or @rid= ('#'+:idds) ) }.outE('SemanticGroup'){ as: e, where: (dist < 10.0) }.inV(){ as: mm, while: ($depth < 2), where: ($matched != $currentMatch) } RETURN mm, e.dist, mm.keywords order by e.dist)", { params: { cls: enttype, idds: ids } })// ", ids.toString(),@rid not id  "
                            .all()
                            .then((select) => {
                                console.log(select.slice(0, 10));
                                return session.close();
                            })
                            .then(() => {
                                // close the pool
                                return pool.close();
                            })
                        );
                })
                .then(() => {
                    return client.close();
                }).then(() => {
                    console.log('Client closed');
                }).catch(err => console.log(err));
            // });
        }).catch(err => console.error(err));
}
// getRelated('#29:25632', 'meet');

async function insertOne(ks) {
    return db.on.then(client => {
        client.sessions({ name: "circ", username: "root", password: "troo" })
            .then(session => nodeinsert(nodes, session)).catch(errr);
        //insert one node
        //py get edges
        //insert edges
    })
        .then(() => {
            return client.close();
        }).then(() => {
            console.log('Client closed');
        }).catch(err => console.log(err));
    // });
}
// batchsert = require('./indexBatchSert');
// batchsert();
const orientypes = {
    CIRC: 'circ',
    MEET: 'meet',
    USER: 'user'
};
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function InData(orientype, sqlid, keywords) {
    this.intype = orientype;// orientypes[orientype] != undefined ? orientypes[orientype] : getKeyByValue(orientypes, orientype);
    this.sqlid = sqlid;
    this.keywords = keywords;
}

// expects an InData, creates one node and calculates connections to all other entities
//which it then adds as edges 
// var ks = new InData(orientypes.CIRC, 0, ['sport', 'rugaciune', 'americani']);
// insertObject(ks);
async function insertObject(indata) {
    let k = indata;
    let nodes = [];
    // let rid = '';
    nodes.push(new Array(k.keywords));// need 2 wrap in xtra list to fit py 
    return db.on.then(async (client) => {
        await client.sessions({ name: "circ", username: "root", password: "troo" })
            .then(async (pool) => {
                return await pool.acquire()
                    .then(async (session) => {
                        console.log('inserting', k);             //insert one node
                        return await session.insert()
                            .into(k.intype)
                            .set(
                                {
                                    id: k.sqlid,
                                    keywords: k.keywords
                                }
                            )
                            .one()
                            .then(async (res) => {
                                console.log('received from insert ', res['@rid']);
                                ids.push(res['@rid'] != undefined ? res['@rid'].toString() : '');
                                // rid = res['@rid'];
                                nodes.push(new Array(ids));
                                console.log('nodes in js ', nodes);
                                await pyOne(nodes);//py get edges                      
                                return session.close();
                            })
                            .catch(errr);
                    }).catch(errr)
                    .then(async () => {
                        return await pool.acquire()
                            .then(async (session) => {
                                return await
                                    edgeinsert(session).catch(errr);
                            }).catch(errr);
                    })
                    .then(() => {
                        return pool.close();
                    });
            })
            .then(() => {
                return client.close();
            }).then(console.log('client closed')).catch(errr);
        // })
    });
}

async function edgeinsert(session, k = 0, kf = null) {
    // let pyres = await nodeinsert();
    console.log('creating ', pyres.length, ' edges');
    var todo = `begin;`;
    var finalcount = kf != null ? kf : pyres.length;
    for (var i = k; i < finalcount; i++) {
        // console.log('i=', i);
        todo = todo.concat(`create edge SemanticGroup from `, pyres[i][0].toString().trim(), ` to `, pyres[i][1].toString().trim(), ` set dist=`, Number(pyres[i][2]), `; `); //`let $n`, i, `=
    }
    todo = todo.concat(`commit;return 2; `);
    // edgeInsertScript.concat(todo);
    console.log(todo);
    await session.batch(todo).all()
        .then((r) => { console.log('success edge insert'); })
        .catch(errr);
    return session.close();
}
// module.exports = insertOne;


module.exports.addone = insertObject;
module.exports.datawrap = InData;
module.exports.getRelated = getRelated;
module.exports.types = orientypes;
// .catch (err => console.error(err));
// }


// });
// .then(result => {
//     console.log(result);
//     nodes.push(result);
// })
// .on('error', (err) => {
//     console.log(err);
//     session.close().then(() => {
//         return client.close;
//     });
// })
// .on('end', () => {
// session.close()
//     .then(() => {
//         // close the pool
//         return pool.close();
//     }).then(() => {
//         return client.close();
//     }).then(() => {
//         console.log('Client closed');
//     });

// session.close();
// })
// .then(() => {
//     // close the pool
//     return pool.close();
// }).then(() => {
//     return client.close();
// }).then(() => {
//     console.log('Client closed');
//     // });


// var pyshell3 = new PythonShell('./py/nlp.py');

// pyshell3.send(JSON.stringify(c1));
// pyshell3.send(JSON.stringify(c2));
// pyshell3.send(JSON.stringify(c3));


// pyshell3 = new PythonShell('./mypy/script.py');
// pyshell3.on('message', function (message) {
    // 
    // received a message sent from the Python script (a simple "print" statement)
    // var lol = [];
    // if (JSON.parse(message).lol != null) {
    //     lol = message.lol;
    //     console.log('has lol :');
    // }
    // else
//     console.log(message);
// });

// pyshell3.end(errr);

