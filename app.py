from flask import Flask, render_template, request, jsonify
import time
import threading

app = Flask(__name__)

# Shared data structure for habits
habits = []

# Background task to decrement displayFrequency
def decrement_habits():
    while True:
        for habit in habits:
            if habit["displayFrequency"] > 0:
                habit["displayFrequency"] -= 1
        time.sleep(1)

@app.route("/")
def index():
    return render_template("index.html", habits=habits)

@app.route("/add_habit", methods=["POST"])
def add_habit():
    data = request.json
    text = data.get("text", "")
    frequency = int(data.get("frequency", 0))
    if text and frequency:
        habits.append({"text": text, "frequency": frequency, "displayFrequency": frequency})
    return jsonify(habits)

@app.route("/reset_habit", methods=["POST"])
def reset_habit():
    text = request.json.get("text", "")
    for habit in habits:
        if habit["text"] == text:
            habit["displayFrequency"] = habit["frequency"]
            break
    return jsonify(habits)

if __name__ == "__main__":
    threading.Thread(target=decrement_habits, daemon=True).start()
    app.run(debug=True)
