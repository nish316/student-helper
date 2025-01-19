document.addEventListener("DOMContentLoaded", function () {
    var askButton = document.getElementById("askButton");
    var questionInput = document.getElementById("question");
    var aiResponse = document.getElementById("aiResponse");
    var subjectSelect = document.getElementById("subjects");
    var connectButton = document.getElementById("connectButton");
    var tutorResponse = document.getElementById("tutorResponse");
    var tutorInfo = document.getElementById("tutorInfo");

    // AI Question Answering
    askButton.onclick = function () {
        var question = questionInput.value.trim();
        var subject = subjectSelect.value;

        if (question === "") {
            aiResponse.innerHTML = "Please enter a question!";
            return;
        }

        aiResponse.innerHTML = "Loading your answer...";

        fetch("http://127.0.0.1:5000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: question, subject: subject })
        })
        .then(response => response.json())
        .then(data => {
            if (data.answer) {
                aiResponse.innerHTML = data.answer;
            } else {
                aiResponse.innerHTML = "Error: " + data.error;
            }
        })
        .catch(error => {
            aiResponse.innerHTML = "An error occurred: " + error;
        });
    };

    // Tutor Assignment
    connectButton.onclick = function () {
        tutorResponse.style.display = "block";
        tutorInfo.innerHTML = "Finding a tutor...";

        let selectedSubject = subjectSelect.value;

        fetch("http://127.0.0.1:5000/find_tutor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: selectedSubject })
        })
        .then(response => response.json())
        .then(data => {
            if (data.tutor) {
                tutorInfo.innerHTML = `
                    <strong>${data.tutor.name}</strong><br>
                    Subject: ${data.tutor.subject}<br>
                    Contact: <a href="mailto:${data.tutor.email}">${data.tutor.email}</a>
                `;
            } else {
                tutorInfo.innerHTML = "No tutors available for this subject.";
            }
        })
        .catch(error => {
            tutorInfo.innerHTML = "An error occurred: " + error;
        });
    };
});
