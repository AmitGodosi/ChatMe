const Conversation = require("../models/Conversation");
const router = require("express").Router();

//new conversation
router.post("/", async (req, res) => {
  try {
    const isExist = await Conversation.findOne({
      members: [req.body.senderId, req.body.reciverId],
    });
    if (!isExist) {
      const newConversation = await new Conversation({
        members: [req.body.senderId, req.body.reciverId],
      });
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else {
      res
        .status(201)
        .json("you already have open conversation with this friend!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user conversations
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
