document.getElementById("habit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("habit-text").value;
    const frequency = parseInt(document.getElementById("habit-frequency").value);
    if (!text || !frequency) return;

    const response = await fetch("/add_habit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, frequency }),
    });
    const habits = await response.json();
    renderHabits(habits);
});

async function resetHabit(text) {
    const response = await fetch("/reset_habit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    const habits = await response.json();
    renderHabits(habits);
}

function renderHabits(habits) {
    const habitsList = document.getElementById("habits-list");
    habitsList.innerHTML = "";
    habits.forEach((habit) => {
        const card = document.createElement("div");
        card.className = "habit-card";
        card.classList.add(
            habit.displayFrequency < 10
                ? "danger"
                : habit.displayFrequency < 1000
                ? "warning"
                : "safe"
        );
        card.innerHTML = `<span>${habit.text}</span><span>${secondsToText(
            habit.displayFrequency
        )}</span>`;
        card.addEventListener("click", () => resetHabit(habit.text));
        habitsList.appendChild(card);
    });
}

function secondsToText(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
    }${secondsLeft > 0 ? secondsLeft + "s" : ""}`.trim();
}
