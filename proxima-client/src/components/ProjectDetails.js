import React, { useState, useEffect } from "react";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { currencyFormatter } from "../utils/currencyFormatter";
import moment from "moment";
import { FaTrash } from "react-icons/fa";
import ProjectForm from "./ProjectForm";

const ProjectDetails = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [tasks, setTasks] = useState(project.tasks || []);
  const [completedTasks, setCompletedTasks] = useState([]);

  const { dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/projects/${project._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await res.json();

    if (res.ok) {
      dispatch({ type: "DELETE_PROJECT", payload: json });
    }
  };

  const handleUpdate = () => {
    setIsModalOpen(true);
    setIsOverlayOpen(true);
  };

  const handleOverlay = () => {
    setIsModalOpen(false);
    setIsOverlayOpen(false);
  };

  const addTask = () => {
    if (newTaskDescription.trim() === "") {
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      description: newTaskDescription,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskDescription("");
  };

  const completeTask = (taskId) => {
    const completedTask = tasks.find((task) => task.id === taskId);
    setCompletedTasks([...completedTasks, completedTask]);

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const calculateProgress = () => {
    const totalActiveTasks = tasks.length;
    const totalCompletedTasks = completedTasks.length;
    const totalTasks = totalActiveTasks + totalCompletedTasks;
  
    const percentage = (totalCompletedTasks / totalTasks) * 100 || 0;
  
    return percentage;
  };
  
  const renderProgressBar = () => {
    const progress = calculateProgress();
  
    return (
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  useEffect(() => {
    // Add 2 default tasks to completed and 2 to active tasks
    const defaultCompletedTasks = [
      { id: 1, description: "Task 1", completed: true },
      { id: 2, description: "Task 2", completed: true }
    ];

    const defaultActiveTasks = [
      { id: 3, description: "Task 3", completed: false },
      { id: 4, description: "Task 4", completed: false }
    ];

    setCompletedTasks(defaultCompletedTasks);
    setTasks(defaultActiveTasks);
  }, []); // Run only once on mount

  return (
    <div className='project'>
      <style>
        {`
          .task-button,
          .add-task-button,
          .update-button,
          .delete-button {
            border: none;
            cursor: pointer;
            padding: 0.5rem 1rem;
            margin: 0.2rem;
            font-size: 0.875rem;
            border-radius: 0.25rem;
          }
          .tasks input {
            background-color: transparent;
            border: 1px solid #ccc;
            color: white;
            padding: 0.5rem;
            margin-right: 0.5rem;
            border-radius: 0.25rem;
          }
          .task-button {
            background-color: #dc3545;
            color: white;
          }

          .add-task-button {
            background-color: #28a745;
            color: white;
          }

          .update-button {
            background-color: #0d6efd;
            color: white;
          }

          .delete-button {
            color: #dc3545;
          }

          .delete-icon {
            color: #dc3545;
            cursor: pointer;
          }

          .progress-bar {
            width: 100%;
            height: 20px;
            border-radius: 5px;
            background-color: #343a40;
            overflow: hidden;
          }

          .progress {
            height: 100%;
            width: ${calculateProgress()}%;
            background-color: #28a745;
            transition: width 0.3s ease-in-out;
          }
        `}
      </style>
    <div className='project bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl flex flex-col gap-5 w-full md:w-[32rem]'>
      <div className='top'>
        <span className='text-sky-400'>{project._id}</span>
        <h3 className='text-3xl font-medium truncate'>{project.title}</h3>
        <span className='text-sm tracking-widest text-slate-500 font-medium'>
          {project.tech}
        </span>
      </div>
      <div className='mid text-slate-300 flex gap-10'>
        <div className='left flex flex-col'>
          <span>Budget: {currencyFormatter(project.budget)}</span>
          <span>
            Added: {moment(project.createdAt).format("MMM DD, hh:mm A")}
          </span>
          <span>
            Updated: {moment(project.updatedAt).format("MMM DD, hh:mm A")}
          </span>
        </div>
        <div className='right flex flex-col'>
          <span>Manager: {project.manager}</span>
          <span>Developers: {project.dev}</span>
          <span>
            Duration:{" "}
            {`${project.duration} Week${project.duration === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
      <div className='tasks'>
        <h4 className='text-lg text-sky-400 mb-2'>Tasks</h4>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => completeTask(task.id)}
              />
              <span>
                {task.description}
                <FaTrash
                  className="delete-icon"
                  onClick={() => removeTask(task.id)}
                />
              </span>
            </li>
          ))}
        </ul>
        {completedTasks.length > 0 && (
          <div>
            <h4 className='text-lg text-sky-400 mb-2'>Completed Tasks</h4>
            <ul>
              {completedTasks.map((task) => (
                <li key={task.id}>
                  <span>{task.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="New task description"
          />
          <button className="add-task-button" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>
      <div className='chart-container'>
  
      <h4 className='text-lg text-sky-400 mb-2'>Progress</h4>
      {renderProgressBar()}
    </div>
    
      <div className='bottom flex gap-5'>
        <button onClick={handleUpdate} className='update-button'>
          Update
        </button>
        <button onClick={handleDelete} className='delete-button'>
          Delete
        </button>
      </div>
      <div
        onClick={handleOverlay}
        className={`overlay fixed z-[1] h-screen w-screen bg-slate-900/50 backdrop-blur-sm top-0 left-0 right-0 bottom-0 ${
          isOverlayOpen ? "" : "hidden"
        }`}
      ></div>
      <div
        className={`update-modal w-[30rem] absolute 2xl:fixed top-0 2xl:top-1/2 2xl:-translate-y-1/2 left-1/2 -translate-x-1/2 bg-slate-800 p-10 rounded-xl border border-slate-700 shadow-xl z-[2] ${
          isModalOpen ? "" : "hidden"
        }`}
      >
        <h2 className='text-4xl text-sky-400 mb-10'>Update project</h2>
        <ProjectForm
          project={project}
          setIsModalOpen={setIsModalOpen}
          setIsOverlayOpen={setIsOverlayOpen}
        />
      </div>
    </div>
    </div>
  );
};

export default ProjectDetails;
