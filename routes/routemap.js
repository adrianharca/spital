var express = require('express');
var router = express.Router();
//this file should only contain routemap then the implementations should be in corresponding files 
//Best practice for RESTful API design is that path params are used to identify a specific resource or resources, 
//while query parameters are used to sort/filter those resources.


//Routes
var relatedController = require("../controllers/related_json_ctrl");

var circleController = require("../controllers/circle_json_ctrl");
var memberController = require("../controllers/membas_json_ctrl");
var userController = require("../controllers/users_json_ctrl");
var imageController = require("../controllers/image_json_ctrl");
var voteController = require("../controllers/vote_json_ctrl");
var meetController = require("../controllers/meet_js_ctrl");
var placeController= require("../controllers/place_json_ctrl");
var interestCategoryController = require("../controllers/category_json_ctrl");
var interestController = require("../controllers/interest_json_ctrl");
var chatController = require("../controllers/chat_json_ctrl");
//prefix /json/circles/etc
// router.use(bodyparser.json);
router.route("/interests").get(interestController.getAllJSON);
router.route("/interests").put(interestController.addOne);

router.route("/circleList").get(imageController.getAllCircles);
router.route("/userList").get(imageController.getAllUsers);

router.route("/categories").get(interestCategoryController.getAll);
router.route("/categories/:id/image").get(interestCategoryController.getImageById);

router.route("/circles").get(circleController.getAll).
    post(circleController.addOne).
    delete(circleController.delete);
router.route("/circles/:id/image").get(circleController.getImageById);
router.route("/circles/:id/image/download").get(circleController.downloadImageById);
router.route("/circles/:id").get(circleController.getCircleByid).
    post(circleController.addOne).
    put(circleController.updatebyId).
    delete(circleController.deleteByid);
router.route("/circles/:id/meets").get(meetController.getMeetsForCircle);

router.route("/circles/:id/members/").get(memberController.getAllMembersByCircle);
router.route("/members").get(memberController.getMemberById).
    post(memberController.createMember).
    delete(memberController.deleteMember);
router.route("/members/:id").put(memberController.updateMember);
router.route("/members/:id/image").get(memberController.getImageById);
router.route("/members/:id/votes").get(voteController.getVotesByMemberId)
    .post(voteController.addVote).delete(voteController.deleteVoteByid);
router.route("/votes").get(voteController.getAll);
router.route("/votes").post(voteController.addVote).delete(voteController.deleteVoteByid);
// router.route("/circles/:id/votes/:voteid").get(circleController.getVotesByCircle);

router.route("/users").get(userController.getAllUsers)//not needed
    .post(userController.createUser)
    .put(userController.updateUserById)
    .delete(userController.delete);

//once we have auth tokens figured out
router.route("/ME").get(userController.getSelfData);
// router.route("/ME/circles").get(circleController.getSelfData);
// router.route("/ME/events").get(circleCtrl.getSelfData);
router.route("/login").post(userController.login);
router.route("/login").put(userController.forgottenPasswordSendMail);
router.route("/signUp").post(userController.createAccount);
router.route("/users/:id/image").get(userController.getImageById);
router.route("/usersName/:name").get(userController.getUserByName);

router.route("/users/:id").get(userController.getUserById)
    .post(userController.createUser)
    .put(userController.updateUserById);


//router.route("/chat").get(chatController.getChatPage);
router.route("/usersEmail/:email").get(userController.getUserByEmail);

router.route("/images").get(imageController.getImages)
    .post(imageController.addImage)
    .put(imageController.updateImage)
    .delete(imageController.delete);
router.route("/meetings").get(meetController.getMeets)
    .post(meetController.addMeet)
    .put(meetController.updateMeet)
    .delete(meetController.deleteMeet);
router.route("/meetings/:id/votes").get(voteController.getVotesByMeetId);
router.route("/meetings/:id/members").get(memberController.getAllMembersByMeetId).post(memberController.createMeetMember);
router.route("/places").post(placeController.createPlace);
router.route("/places/:id").get(placeController.getPlaceById);
router.route("/places").get(placeController.getAll);
router.route("/similar/:type/:id").get(relatedController.getRelated).post(relatedController.add); //relatedController.getRelated);
// router.route("/members");
//INTERFACE
// router.use("/circles", require('./circles'));
module.exports = router;