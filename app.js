const tg = window.Telegram.WebApp

tg.ready();
tg.expand();

console.log(tg.initData);
console.log(tg.initDataUnsafe);
console.log(tg.initDataUnsafe.start_param);

function send() {
    const value = document.getElementById("input").value;

    tg.sendData(JSON.stringify({
        action: "save",
        value: value
    }));
}

