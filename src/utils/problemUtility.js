const axios = require("axios");

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };

    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    try {
        const response = await axios.post(
            "http://localhost:2358/submissions/batch?base64_encoded=false&wait=false",
            { submissions }
        );

        return response.data;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
};

const getBatchResult = async (tokens) => {
    try {
        const tokenString = tokens.join(",");

        const response = await axios.get(
            `http://localhost:2358/submissions/batch?tokens=${tokenString}&base64_encoded=false`
        );

        return response.data.submissions;
    } catch (err) {
        console.error(err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    getLanguageById,
    submitBatch,
    getBatchResult
};