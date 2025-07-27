import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    priority: {
      type: String,
      enum: { values: ["High", "Medium", "Low"], default: "Medium" },
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        default: "pending",
      },
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachment: [{ type: String }],
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },

  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
