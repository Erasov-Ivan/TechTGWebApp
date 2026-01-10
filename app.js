const tg = window.Telegram.WebApp;
tg.expand();

const startParam = tg.initDataUnsafe?.start_param;
document.getElementById("input").value = startParam;

function send() {
    const value = document.getElementById("input").value;

    tg.sendData(JSON.stringify({
        action: "save",
        value: value
    }));
}
