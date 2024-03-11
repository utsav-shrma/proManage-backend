
const express = require("express");
const cardPublicRouter = express.Router();
const { Card } = require("../models/card");

//get card by id
cardPublicRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let response = await Card.findOne({ _id: id });
    if (!response) {
      return res.status(404).json({ error: "card does not exist" });
    }

    if(!response.isPublic){
        return res.status(401).json({error:"unauthorized access"});
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "error occured" });
  }
});

  module.exports = cardPublicRouter;