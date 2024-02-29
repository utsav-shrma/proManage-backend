const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema=new Schema({

    task:{
        type:String,
        required:true,
    },
    isChecked:{
        type:Boolean,
        default: false,
    },
    

});

const cardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tasks:{
    type:[taskSchema],
    // require:true,
  },
  dueDate: {
    type: Date,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  status: {
    type:String,
    default:'toDo',
    enum: ['toDo', 'done', 'inProgress', 'backlog'],
  },
  priority: {
    type:String,
    required:true,
    default:'low',
    enum: ['low', 'medium', 'high'],
  },
  userId: {
    type:mongoose.Types.ObjectId,
    required:true,
  },


});

module.exports = {
    Card:mongoose.model('card', cardSchema),
    Task:mongoose.model('task', taskSchema)
};
