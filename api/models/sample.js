const axios = require('axios');

// Function to make a POST request to the Flask server
async function predictCategory(inputData) {
    try {
        const response = await axios.post('http://127.0.0.1:8000/predict', {
            data: inputData
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const content = "Virat Kohli hits a six in the last ball of the match to notch up his 75 century in ODI international";

predictCategory(content)
  .then(categorys => {
    const category = categorys;
  })
  .catch(err => {
    console.error('Error:', err);
  });
