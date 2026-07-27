const express = require("express");

const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

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
problemRouter.patch("/:id", updateProblem);

// Delete
problemRouter.delete("/:id", deleteProblem);

// Fetch
problemRouter.get("/:id", getProblemById);
problemRouter.get("/", getAllProblem);
problemRouter.get("/user", solvedAllProblembyUser);

module.exports = problemRouter;