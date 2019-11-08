const models = require('./models');
const User = models.User;

exports.createUser = function (req, res) {
    let { name, firstname, lastname, email, acctype,
        bday, pass, description, interests,
        trustscore, img, gender } = req.body;
    let errors = [];
    if (errors.length > 0) {
        res.put('err', {
            errors
        });
    } else {
        User.create({
            name, firstname, lastname, email, acctype,
            bday, pass, description, interests,
            trustscore, img, gender
        }).then(a => {
            console.log('added user' + a.id);
            res.json(a.id);
        }).catch(err => console.log(err));

    }
}