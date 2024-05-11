from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

app = Flask(__name__)

# Load CountVectorizer model
countVectorizer = joblib.load('count_vectorizer.pkl')

# Load MultinomialNB model
multinomialNBModel = joblib.load('multinomial_nb_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        content = request.json.get('data', '')
        if not content:
            return 'Error: Content not provided', 400

        # Call the prediction function
        category = predict_category(content)

        return category
    except Exception as e:
        return 'Error: ' + str(e), 500


def predict_category(content):
    X = countVectorizer.transform([content])
    prediction = multinomialNBModel.predict_proba(X)
    max_index = prediction.argmax(axis=1)[0]

    if max_index == 0:
        category = "WORLD"
    elif max_index == 1:
        category = "SPORTS"
    elif max_index == 2:
        category = "BUSINESS"
    else:
        category = "SCI"

    return category

if __name__ == '__main__':
    app.run(debug=True,port=8000)
