const express = require("express");
const cardRouter = express.Router();
const { Card, Task } = require("../models/card");

//create
cardRouter.post("/", async (req, res) => {
  try {
    let userId = req.body.userId;
    let { title, tasks, dueDate, isPublic, status, priority } = req.body;

    let newTasks = new Array();

    if (!title || !tasks) {
      return res.status(400).json({ message: "bad request" });
    }

    tasks.map(({ task, isChecked }) => {
      if (!task) {
        return res.status(400).json({ message: "bad request" });
      }
      const newTask = new Task({ task, isChecked });
      newTasks.push(newTask);
    });

    let newCard = new Card({
      title,
      tasks: newTasks,
      dueDate,
      isPublic,
      status,
      priority,
      userId,
    });

    newCard.save();

    return res.status(200).json({ message: "Card created successfully" });
  } catch (error) {
    console.log(console.log(error));
  }
});

//update
cardRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let userId = req.body.userId;
    let { title, tasks, dueDate, isPublic, status, priority } = req.body;

    let newTasks = new Array();

    if (!title || !tasks) {
      return res.status(400).json({ message: "bad request" });
    }

    tasks.map(({ task, isChecked }) => {
      if (!task) {
        return res.status(400).json({ message: "bad request" });
      }
      const newTask = new Task({ task, isChecked });
      newTasks.push(newTask);
    });

    let response = await Card.updateOne(
      { _id: id },
      {
        $set: {
          title,
          tasks: newTasks,
          dueDate,
          isPublic,
          status,
          priority,
          userId,
        },
      }
    );

    if (response.modifiedCount === 0) {
      return res.status(404).json({ error: "card does not exist" });
    }

    return res.status(200).json({ message: "Card Updated successfully" });
  } catch (error) {
    console.log(console.log(error));
    res.status(400).json({ error: "error occured" });
  }
});

//delete
cardRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let response = await Card.deleteOne({ _id: id });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: "card does not exist" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "error occured" });
  }
});


//share
cardRouter.patch("/share/:id", async (req, res) => {
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

//update status
cardRouter.patch("/status/:id", async (req, res) => {
  const { id } = req.params;
  let { status } = req.body;
  try {
    let response = await Card.findOneAndUpdate(
      { _id: id },
      { $set: { status } }
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

//add tick
cardRouter.patch("/task/:task", async (req, res) => {
  let { isChecked } = req.body;
  let taskId = req.params.task;
  try {
    let response = await Card.updateOne(
      { "tasks._id": taskId },
      { $set: { "tasks.$.isChecked": isChecked } }
    );

    if (response.modifiedCount === 0) {
      return res.status(404).json({ error: "task does not exist" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error occured" });
  }
});

//analytics
cardRouter.get("/analytics", async (req, res) => {
  let userId = req.body.userId;
  console.log(userId);
  try {
    let cards = await Card.find({ userId: userId });
    let backlog = cards.filter((card) => card.status === "backlog").length;
    let toDo = cards.filter((card) => card.status === "toDo").length;
    let inProgress = cards.filter(
      (card) => card.status === "inProgress"
    ).length;
    let completed = cards.filter((card) => card.status === "done").length;
    let low = cards.filter((card) => card.priority === "low").length;
    let medium = cards.filter((card) => card.priority === "medium").length;
    let high = cards.filter((card) => card.priority === "high").length;
    let dueDate = cards.filter(
      (card) => card.dueDate !== null && card.dueDate !== undefined
    ).length;

    return res.status(200).json({
      backlog,
      toDo,
      inProgress,
      completed,
      low,
      medium,
      high,
      dueDate,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error occured" });
  }
});

//get all  .
cardRouter.get("/:duration?", async (req, res) => {
  let userId = req.body.userId;
  let {duration}=req.params;

  let currDate=new Date();
  let today=new Date(currDate).setHours(0, 0, 0, 0);
  let lastWeek=new Date().setDate(currDate.getDate() - 7);
  let lastMonth=new Date(currDate).setDate(currDate.getDate() - 30);

  let query={ userId: userId , createdAt:{$gte:lastWeek}};  //default last week

  if(duration==="today"){
    query={ userId: userId  , createdAt:{$gte:today,$lte:currDate}}; 
  }
  if(duration==="lastMonth"){
    query={ userId: userId  , createdAt:{$gte:lastMonth}}; 
  }

  try {
    
    let cards = await Card.find(query);
    let backlog = cards.filter((card) => card.status === "backlog");
    let toDo = cards.filter((card) => card.status === "toDo");
    let inProgress = cards.filter((card) => card.status === "inProgress");
    let done = cards.filter((card) => card.status === "done");
    res.status(200).json({ backlog, inProgress, toDo, done });
  } catch (error) {
    console.log(console.log(error));
  }
});



module.exports = cardRouter;
