const axios = require("axios");

const getLanguageById = (lang) => {
    const language = {
        "c++": "cpp17",
        "java": "java",
        "javascript": "nodejs"
    };

    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    try {
        const results = [];

        for (const submission of submissions) {
            const response = await axios.post(
                "https://api.jdoodle.com/v1/execute",
                {
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                    script: submission.source_code,
                    language: submission.language_id,
                    versionIndex: "0",
                    stdin: submission.stdin
                }
            );

            results.push({
                output: response.data.output,
                expected_output: submission.expected_output,
                statusCode: response.data.statusCode,
                isExecutionSuccess: response.data.isExecutionSuccess
            });
        }

        return results;

    } catch (err) {
        console.error("JDoodle Error:");
        console.error(err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getLanguageById,
    submitBatch
};