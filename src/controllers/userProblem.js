const {
    getLanguageById,
    submitBatch,
    getBatchResult
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
        problemCreator
    } = req.body;

    try {

        // Check every reference solution
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

            // Submit to Judge0
            const submitResult = await submitBatch(submissions);

            console.log("Submission Tokens:", submitResult);

            // Extract tokens
            const tokens = submitResult.map((result) => result.token);

            // Wait for Judge0 to execute
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get execution results
            const results = await getBatchResult(tokens);

            console.log("Judge0 Results:");
            console.log(results);
        }

        return res.status(200).json({
            success: true,
            message: "Judge0 integration working."
        });

    } catch(err){
    console.error("ERROR:");
    console.error(err.response?.data || err);

    return res.status(500).json({
        success: false,
        message: err.message
    });
}
};

const updateProblem = (req, res) => {
    res.send("Update Problem");
};

const deleteProblem = (req, res) => {
    res.send("Delete Problem");
};

const getProblemById = (req, res) => {
    res.send("Get Problem By ID");
};

const getAllProblem = (req, res) => {
    res.send("Get All Problems");
};

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