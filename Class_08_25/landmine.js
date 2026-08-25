"use strict";
let elementList = document.querySelectorAll(".landmine td");
let gameOver = false;
for (const element of elementList) {
    element.addEventListener("click", () => {
        if (!gameOver) {
            if (element.classList.value === "mine") {
                element.classList.add("exploded");
                elementList.forEach((element) => {
                    element.textContent = "❌";
                    element.classList.add("revealed");
                    gameOver = true;
                });
                element.textContent = "💥";
            }
            element.classList.add("revealed");
            console.log(element.textContent);
            console.log(element.classList.value);
        }
    });
}
