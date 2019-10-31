var express = require('express');
const bodyparser=require('body-parser');
var router = express.Router();

//this file should only contain routemap then the implementations should be in corresponding files 



//Routes
var circleController = require("../controllers/circle_json_ctrl");
//prefix /json/circles/etc
// router.use(bodyparser.json);
router.route("/circles").get(circleController.getAll).
    post(circleController.addOne) .
    delete(circleController.delete);
router.route("/circles/:id").get(circleController.getByid).
    post(circleController.updatebyId).
    delete(circleController.deleteByid);
// router.route("/circles/:id/members/").get(circleController.getAllMembersBycircle);
// router.route("/circles/:id/members/:memberid").get(circleController.getMemberById).
//                                                 put(circleController.addMember);
// router.route("/circles/:id/votes/:voteid").get(circleController.getVotesByCircle);

//router.route("/users").get(userController.getAll);

// router.route("/members");
//INTERFACE
// router.use("/circles", require('./circles'));
module.exports = router;