let tg = window.Telegram.WebApp
tg.expand();

console.log(tg.initDataUnsafe);

function send() {
    const value = document.getElementById("input").value;

    tg.sendData(JSON.stringify({
        action: "save",
        value: value
    }));
}
