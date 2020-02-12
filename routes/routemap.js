var express = require('express');
var router = express.Router();

//this file should only contain routemap then the implementations should be in corresponding files 



//Routes
var meetingController = require("../controllers/meeting_json_ctrl");
var memberController = require("../controllers/membas_json_ctrl")
var userController = require("../controllers/users_json_ctrl");
var imageController = require("../controllers/image_json_ctrl");
var voteController = require("../controllers/vote_json_ctrl");
var chatController = require("../controllers/chat_json_ctrl");
//prefix /json/meetings/etc
// router.use(bodyparser.json);
router.route("/meetingList").get(imageController.getAllMeetings);
router.route("/userList").get(imageController.getAllUsers);
router.route("/meetings").get(meetingController.getAll).
    post(meetingController.addOne).
    delete(meetingController.delete);
router.route("/meetings/:id/image").get(meetingController.getImageById);
router.route("/meetings/:id/image/download").get(meetingController.downloadImageById);
router.route("/meetings/:id").get(meetingController.getMeetingByid).
    post(meetingController.addOne).
    put(meetingController.updatebyId).
    delete(meetingController.deleteByid);

router.route("/meetings/:id/members/").get(memberController.getAllMembersByMeeting);
router.route("/members").get(memberController.getMemberById).
    post(memberController.createMember).
    delete(memberController.deleteMember);
router.route("/members/:id").put(memberController.updateMember);
router.route("/members/:id/image").get(memberController.getImageById);
router.route("/members/:id/votes").get(voteController.getVotesByMemberId)
    .post(voteController.addVote).delete(voteController.deleteVoteByid);
router.route('/votes').get(voteController.getAll);
router.route("/votes").post(voteController.addVote).delete(voteController.deleteVoteByid);
// router.route("/meetings/:id/votes/:voteid").get(meetingController.getVotesByMeeting);

router.route("/users").get(userController.getAllUsers)//not needed
    .post(userController.createUser)
    .put(userController.updateUserById)
    .delete(userController.delete);

//once we have auth tokens figured out
router.route("/ME").get(userController.getSelfData);
// router.route("/ME/meetings").get(meetingController.getSelfData);
// router.route("/ME/events").get(meetingCtrl.getSelfData);

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


// router.route("/members");
//INTERFACE
// router.use("/meetings", require('./meetings'));
module.exports = router;