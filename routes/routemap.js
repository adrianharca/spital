var express = require('express');
var router = express.Router();

//this file should only contain routemap then the implementations should be in corresponding files 



//Routes
var circleController = require("../controllers/circle_json_ctrl");
var memberController= require ("../controllers/membas_json_ctrl")
var userController = require("../controllers/users_json_ctrl");
var imageController = require("../controllers/image_json_ctrl");
 var chatController = require("../controllers/chat_json_ctrl");
//prefix /json/circles/etc
// router.use(bodyparser.json);
router.route("/circleList").get(imageController.getAllCircles);
router.route("/userList").get(imageController.getAllUsers);
router.route("/circles").get(circleController.getAll).
    post(circleController.addOne).
    delete(circleController.delete);
router.route("/circles/:id/image").get(circleController.getImageById);
router.route("/circles/:id/image/download").get(circleController.downloadImageById);
router.route("/circles/:id").get(circleController.getCircleByid).
    post(circleController.addOne).
    put(circleController.updatebyId).
    delete(circleController.deleteByid);

router.route("/circles/:id/members/").get(memberController.getAllMembersByCircle);
router.route("/members").get(memberController.getMemberById).
    post(memberController.createMember).
    delete(memberController.deleteMember);
router.route("/members/:id").put(memberController.updateMember);
router.route("/members/:id/image").get(memberController.getImageById);
// router.route("/circles/:id/votes/:voteid").get(circleController.getVotesByCircle);

router.route("/users").get(userController.getAllUsers)
                      .post(userController.createUser)
                      .delete(userController.delete);
router.route("/users/:id/image").get(userController.getImageById);                      
router.route("/usersName/:name").get(userController.getUserByName);

router.route("/users/:id").get(userController.getUserById)
                            .post(userController.createUser)
                            .put(userController.updateUserById);
                            
router.route("/users/:id/image").get(userController.getImageById);

//router.route("/chat").get(chatController.getChatPage);
router.route("/usersEmail/:email").get(userController.getUserByEmail);

router.route("/images").get(imageController.getImages)
                       .post(imageController.addImage)
                       .put(imageController.updateImage)
                       .delete(imageController.delete);
// router.route("/members");
//INTERFACE
// router.use("/circles", require('./circles'));
module.exports = router;