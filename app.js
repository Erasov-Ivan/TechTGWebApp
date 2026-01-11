const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const params = new URLSearchParams(window.location.search);

const leftItems = JSON.parse(params.get("left") || "[]");
const rightItems = JSON.parse(params.get("right") || "[]");

function renderColumn(columnId, items) {
    const column = document.getElementById(columnId);
    column.innerHTML = "";

    items.forEach(text => {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = text;

        column.appendChild(card);
    });
}

renderColumn("left-column", leftItems);
renderColumn("right-column", rightItems);


let activeCard = null;
let activeColumn = null;
let pointerId = null;

document.addEventListener("pointerdown", (e) => {
    if (!e.target.classList.contains("card")) return;

    e.preventDefault();

    activeCard = e.target;
    activeColumn = activeCard.parentElement;
    pointerId = e.pointerId;

    activeCard.classList.add("dragging");
    activeCard.setPointerCapture(pointerId);
});

document.addEventListener("pointermove", (e) => {
    if (!activeCard || e.pointerId !== pointerId) return;

    e.preventDefault();

    const cards = [...activeColumn.querySelectorAll(".card")];

    for (const card of cards) {
        if (card === activeCard) continue;

        const rect = card.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;

        if (e.clientY < middle && card.previousElementSibling !== activeCard) {
            activeColumn.insertBefore(activeCard, card);
            break;
        }

        if (
            e.clientY > middle &&
            card.nextElementSibling !== activeCard
        ) {
            activeColumn.insertBefore(activeCard, card.nextElementSibling);
            break;
        }
    }
});

function finishDrag() {
    if (!activeCard) return;

    try {
        activeCard.releasePointerCapture(pointerId);
    } catch (_) {}

    activeCard.classList.remove("dragging");
    activeCard = null;
    activeColumn = null;
    pointerId = null;
}

document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);
document.addEventListener("pointerleave", finishDrag);

function getColumnData(columnId) {
    return [...document.getElementById(columnId).children]
        .map(card => card.textContent);
}

tg.MainButton.setText("Сохранить");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        left: getColumnData("left-column"),
        right: getColumnData("right-column")
    }));
});
