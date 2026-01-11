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
// Рендер колонок с кнопками
// ========================
function renderColumn(columnId, items) {
    const column = document.getElementById(columnId);
    column.innerHTML = "";

    items.forEach(text => {
        const card = createCard(text);
        column.appendChild(card);
    });
}

// ========================
// Создание карточки с кнопками
// ========================
function createCard(text) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = text;

    // контейнер для кнопок
    const btnContainer = document.createElement("span");
    btnContainer.style.float = "right";

    // кнопка +
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.style.marginLeft = "4px";
    plusBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // чтобы не срабатывал swap
        const newCard = createCard(card.textContent.replace(/^🔄\s*/, ""));
        card.parentElement.insertBefore(newCard, card.nextSibling);
    });

    // кнопка -
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "–";
    minusBtn.style.marginLeft = "4px";
    minusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.remove();
    });

    btnContainer.appendChild(plusBtn);
    btnContainer.appendChild(minusBtn);
    card.appendChild(btnContainer);

    return card;
}

// ========================
// Инициализация колонок
// ========================
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

    const next1 = card1.nextSibling;
    const next2 = card2.nextSibling;

    if (next1 === card2) {
        col.insertBefore(card2, card1);
    } else if (next2 === card1) {
        col.insertBefore(card1, card2);
    } else {
        col.insertBefore(card2, next1);
        col.insertBefore(card1, next2);
    }
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
        .map(card => card.textContent.replace(/^🔄\s*/, "").replace(/\+|\–/g, "").trim());
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
