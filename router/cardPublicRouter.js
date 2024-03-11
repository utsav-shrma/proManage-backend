
const express = require("express");
const cardPublicRouter = express.Router();
const { Card } = require("../models/card");

//share
cardPublicRouter.patch("/share/:id", async (req, res) => {
    const { id } = req.params;
    try {
      let response = await Card.findOneAndUpdate(
        { _id: id },
        { $set: { isPublic: true } }
      );
      if (!response) {
        return res.status(404).json({ error: "obj not found" });
      }
  
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "error occured" });
    }
  });

  module.exports = cardPublicRouter;