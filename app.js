// ========================
// Telegram init
// ========================
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

// ========================
// Получаем массивы из URL
// ========================
const params = new URLSearchParams(window.location.search);

const leftItems = JSON.parse(params.get("left") || "[]");
const rightItems = JSON.parse(params.get("right") || "[]");

// ========================
// Рендер колонок
// ========================
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

// ========================
// Swap logic (tap → tap)
// ========================
let activeCard = null;

document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    // если ещё не выбрали активную
    if (!activeCard) {
        activeCard = card;
        activeCard.classList.add("active");
        activeCard.textContent = "🔄 " + activeCard.textContent;
        return;
    }

    // кликнули на ту же самую
    if (activeCard === card) {
        resetActive();
        return;
    }

    // только внутри одной колонки
    if (activeCard.parentElement !== card.parentElement) {
        resetActive();
        return;
    }

    // меняем местами
    swapCards(activeCard, card);
    resetActive();
});

function swapCards(card1, card2) {
    const col = card1.parentElement;
    const next1 = card1.nextSibling === card2 ? card1 : card1.nextSibling;
    col.insertBefore(card2, next1);
    col.insertBefore(card1, card2);
}

function resetActive() {
    if (!activeCard) return;

    activeCard.classList.remove("active");
    activeCard.textContent = activeCard.textContent.replace(/^🔄\s*/, "");
    activeCard = null;
}

// ========================
// Получение результата
// ========================
function getColumnData(columnId) {
    return [...document.getElementById(columnId).children]
        .map(card => card.textContent.replace(/^🔄\s*/, ""));
}

// ========================
// Telegram MainButton
// ========================
tg.MainButton.setText("Сохранить");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        left: getColumnData("left-column"),
        right: getColumnData("right-column")
    }));
});
