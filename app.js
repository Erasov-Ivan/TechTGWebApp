const tg = window.Telegram.WebApp;
tg.expand();

function send() {
    const value = document.getElementById("input").value;

    tg.sendData(JSON.stringify({
        action: "save",
        value: value
    }));
}
