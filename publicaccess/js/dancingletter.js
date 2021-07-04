var test = document.getElementById("test");

var text = "YelpTemple!";
var result = "";
//effect
window.addEventListener("load", (event) => {
    for (let i = 0; i < text.length; i++) {
        setTimeout(function () {
            result += text[i];
            test.innerHTML = result;
        }, 120 * i);
    }
});
