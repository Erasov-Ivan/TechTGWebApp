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
        card.draggable = true;

        column.appendChild(card);
    });
}

renderColumn("left-column", leftItems);
renderColumn("right-column", rightItems);


let draggedCard = null;

document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("card")) {
        draggedCard = e.target;
    }
});

document.addEventListener("dragover", (e) => {
    if (
        e.target.classList.contains("card") &&
        e.target.parentElement === draggedCard?.parentElement
    ) {
        e.preventDefault();
    }
});

document.addEventListener("drop", (e) => {
    if (
        e.target.classList.contains("card") &&
        e.target.parentElement === draggedCard.parentElement
    ) {
        const column = e.target.parentElement;
        const cards = [...column.children];

        const draggedIndex = cards.indexOf(draggedCard);
        const targetIndex = cards.indexOf(e.target);

        if (draggedIndex < targetIndex) {
            column.insertBefore(draggedCard, e.target.nextSibling);
        } else {
            column.insertBefore(draggedCard, e.target);
        }
    }
});


function getColumnData(columnId) {
    return [...document.getElementById(columnId).children]
        .map(card => card.textContent);
}


let activeCard = null;
let startY = 0;

document.addEventListener("pointerdown", (e) => {
    if (!e.target.classList.contains("card")) return;

    activeCard = e.target;
    startY = e.clientY;

    activeCard.setPointerCapture(e.pointerId);
    activeCard.classList.add("dragging");
});

document.addEventListener("pointermove", (e) => {
    if (!activeCard) return;

    const column = activeCard.parentElement;
    const cards = [...column.querySelectorAll(".card")];

    cards.forEach(card => {
        if (card === activeCard) return;

        const rect = card.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;

        if (e.clientY < middle && card.previousSibling !== activeCard) {
            column.insertBefore(activeCard, card);
        } else if (
            e.clientY > middle &&
            card.nextSibling !== activeCard
        ) {
            column.insertBefore(activeCard, card.nextSibling);
        }
    });
});

document.addEventListener("pointerup", () => {
    if (!activeCard) return;

    activeCard.classList.remove("dragging");
    activeCard = null;
});



tg.MainButton.setText("Сохранить");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        left: getColumnData("left-column"),
        right: getColumnData("right-column")
    }));
});
