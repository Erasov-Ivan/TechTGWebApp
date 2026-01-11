const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const params = new URLSearchParams(window.location.search);
const leftItems = JSON.parse(params.get("left") || "[]");
const rightItems = JSON.parse(params.get("right") || "[]");

let activeCard = null;

function createCard(text) {
    const card = document.createElement("div");
    card.className = "card";

    const swapSpan = document.createElement("span");
    swapSpan.className = "swap-indicator";

    const textSpan = document.createElement("span");
    textSpan.className = "card-text";
    textSpan.textContent = text;

    const btnContainer = document.createElement("span");
    btnContainer.className = "card-buttons";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.onclick = (e) => {
        e.stopPropagation();
        const newCard = createCard(text);
        card.parentElement.insertBefore(newCard, card.nextSibling);
        resetActive();
    };

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "–";
    minusBtn.onclick = (e) => {
        e.stopPropagation();
        card.remove();
        resetActive();
    };

    btnContainer.append(plusBtn, minusBtn);
    card.append(swapSpan, textSpan, btnContainer);

    return card;
}

function renderColumn(id, items) {
    const col = document.getElementById(id);
    col.innerHTML = "";
    items.forEach(t => col.appendChild(createCard(t)));
}

renderColumn("left-column", leftItems);
renderColumn("right-column", rightItems);

document.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;

    if (!activeCard) {
        activeCard = card;
        card.classList.add("active");
        card.querySelector(".swap-indicator").textContent = "🔄";
        return;
    }

    if (activeCard === card || activeCard.parentElement !== card.parentElement) {
        resetActive();
        return;
    }

    swapCards(activeCard, card);
    resetActive();
});

function swapCards(a, b) {
    const aNext = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    b.parentNode.insertBefore(b, aNext);
}

function resetActive() {
    if (!activeCard) return;
    activeCard.classList.remove("active");
    activeCard.querySelector(".swap-indicator").textContent = "";
    activeCard = null;
}

function getColumnData(id) {
    return [...document.getElementById(id).children]
        .map(c => c.querySelector(".card-text").textContent);
}

tg.MainButton.setText("Сохранить");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({
        left: getColumnData("left-column"),
        right: getColumnData("right-column")
    }));
});
