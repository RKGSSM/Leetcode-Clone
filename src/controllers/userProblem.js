const Problem = require("../models/problem");

const {
    getLanguageById,
    submitBatch
} = require("../utils/problemUtility");

const createProblem = async (req, res) => {

    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        
    } = req.body;

    try {

        // Verify every reference solution
        for (const { language, completeCode } of referenceSolution) {

            console.log("Language received:", language);

            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({
                    success: false,
                    message: `Unsupported language: ${language}`
                });
            }

            // Create submissions for all visible test cases
            const submissions = visibleTestCases.map((test) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: test.input,
                expected_output: test.output
            }));

            // Execute all test cases using JDoodle
            const results = await submitBatch(submissions);

            console.log("JDoodle Results:");
            console.log(results);

            // Check every result
            for (const result of results) {

                const actualOutput = (result.output || "").trim();
                const expectedOutput = (result.expected_output || "").trim();

                if (!result.isExecutionSuccess ||actualOutput !== expectedOutput) {
                    return res.status(400).json({
                        success: false,
                        message: "Reference solution failed one or more test cases."
                    });
                }
            }
        }

        // Save problem to MongoDB
        const problem = new Problem({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            problemCreator: req.result._id
        });

        await problem.save();

        return res.status(201).json({
            success: true,
            message: "Problem created successfully.",
            problem
        });

    } catch (err) {

        console.error("ERROR:");
        console.error(err.response?.data || err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateProblem = async (req, res) => {

    const { id } = req.params;

    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution
    } = req.body;

    try {

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required."
            });
        }

        // Check whether problem exists
        const existingProblem = await Problem.findById(id);

        if (!existingProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found."
            });
        }

        // Verify every reference solution
        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({
                    success: false,
                    message: `Unsupported language: ${language}`
                });
            }

            const submissions = visibleTestCases.map(test => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: test.input,
                expected_output: test.output
            }));

            const results = await submitBatch(submissions);

            for (const result of results) {

                const actualOutput = (result.output || "").trim();
                const expectedOutput = (result.expected_output || "").trim();

                if (
                    !result.isExecutionSuccess ||
                    actualOutput !== expectedOutput
                ) {

                    return res.status(400).json({
                        success: false,
                        message: "Reference solution failed one or more test cases."
                    });

                }
            }
        }

        // Update problem
        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            {
                title,
                description,
                difficulty,
                tags,
                visibleTestCases,
                hiddenTestCases,
                startCode,
                referenceSolution
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Problem updated successfully.",
            problem: updatedProblem
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteProblem = async (req, res) => {

    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required."
            });
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully."
        });

    } catch (err) {

        console.error("ERROR:");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getProblemById = async (req, res) => {

    const { id } = req.params;

    try {

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required."
            });
        }

        // Find problem by ID
        const problem = await Problem.findById(id);

        // If problem doesn't exist
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found."
            });
        }

        // Return the problem
        return res.status(200).json({
            success: true,
            problem
        });

    } catch (err) {

        console.error("ERROR:");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({});

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const solvedAllProblembyUser = (req, res) => {
    res.send("Solved Problems");
};

module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    solvedAllProblembyUser
};