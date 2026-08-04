const express = require("express");

const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    solvedAllProblembyUser
} = require("../controllers/userProblem");

// Create
problemRouter.post("/create", adminMiddleware, createProblem);

// Update
problemRouter.patch("/:id",adminMiddleware, updateProblem);

// Delete
problemRouter.delete("/:id", adminMiddleware,deleteProblem);

// Fetch
problemRouter.get("/:id",userMiddleware, getProblemById);
problemRouter.get("/", userMiddleware,getAllProblem);
problemRouter.get("/user",userMiddleware, solvedAllProblembyUser);

module.exports = problemRouter;