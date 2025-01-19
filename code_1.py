import google.generativeai as genai
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@app.route("/ask", methods=["POST"])
def ask_gemini():
    try:
        data = request.json
        question = data.get("question", "").strip()
        subject = data.get("subject", "General").strip().lower()

        if not question:
            return jsonify({"error": "Please enter a math question."}), 400

        if subject not in ["algebra", "geometry", "statistics", "calculus"]:
            return jsonify({"error": "Invalid subject. Choose Algebra, Geometry, Statistics, or Calculus."}), 400

        system_message = f"You are a highly skilled math tutor. Explain answers clearly for a student learning {subject}."

        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content([system_message, question])

        answer = response.generations[0].text

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



tutors = [
    {"name": "Alice Johnson", "subject": "algebra", "email": "alice@example.com"},
    {"name": "Bob Smith", "subject": "geometry", "email": "bob@example.com"},
    {"name": "Charlie Davis", "subject": "calculus", "email": "charlie@example.com"},
    {"name": "Diana Evans", "subject": "statistics", "email": "diana@example.com"}
]

@app.route("/find_tutor", methods=["POST"])
def find_tutor():
    try:
        data = request.json
        selected_subject = data.get("subject", "").lower()  # Get subject from request

        # Find tutors that match the selected subject
        matching_tutors = [tutor for tutor in tutors if tutor["subject"] == selected_subject]

        if matching_tutors:
            import random
            selected_tutor = random.choice(matching_tutors)  # Pick a random tutor
            return jsonify({"tutor": selected_tutor})
        else:
            return jsonify({"error": "No available tutors for this subject."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)