const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const params = new URLSearchParams(window.location.search);

const leftItems = JSON.parse(params.get("left") || "[]");
const rightItems = JSON.parse(params.get("right") || "[]");

function createCard(text) {
    const card = document.createElement("div");
    card.className = "card";

    const textSpan = document.createElement("span");
    textSpan.className = "card-text";
    textSpan.textContent = text;

    const swapSpan = document.createElement("span");
    swapSpan.className = "swap-indicator";

    const btnContainer = document.createElement("span");
    btnContainer.className = "card-buttons";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newCard = createCard(textSpan.textContent);
        card.parentElement.insertBefore(newCard, card.nextSibling);
    });

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "–";
    minusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.remove();
    });

    btnContainer.appendChild(plusBtn);
    btnContainer.appendChild(minusBtn);

    card.appendChild(swapSpan);
    card.appendChild(textSpan);
    card.appendChild(btnContainer);

    return card;
}

function renderColumn(columnId, items) {
    const column = document.getElementById(columnId);
    column.innerHTML = "";
    items.forEach(text => {
        column.appendChild(createCard(text));
    });
}

renderColumn("left-column", leftItems);
renderColumn("right-column", rightItems);

let activeCard = null;

document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    if (!activeCard) {
        activeCard = card;
        activeCard.classList.add("active");
        activeCard.querySelector(".swap-indicator").textContent = "🔄";
        return;
    }

    if (activeCard === card || activeCard.parentElement !== card.parentElement) {
        resetActive();
        return;
    }

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
    activeCard.querySelector(".swap-indicator").textContent = "";
    activeCard = null;
}

function getColumnData(columnId) {
    return [...document.getElementById(columnId).children].map(card =>
        card.querySelector(".card-text").textContent
    );
}

tg.MainButton.setText("Сохранить");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        left: getColumnData("left-column"),
        right: getColumnData("right-column")
    }));
});
