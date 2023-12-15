const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Assuming you have a Project model
    required: true,
  },
  task_id: {
    type: Number,
    required: true,
  },
  task_description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
