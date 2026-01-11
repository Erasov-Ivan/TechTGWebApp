const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const params = new URLSearchParams(window.location.search);
console.log(params);


function send() {
    const value = document.getElementById("input").value;

    tg.sendData(JSON.stringify({
        action: "save",
        value: value
    }));
}
