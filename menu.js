// メニュー用

const menu_btn = document.getElementById("menu_btn");
const menu = document.getElementById("menu");
const header_bg = document.getElementById("header_bg");

menu_btn.addEventListener("click", () => {
    menu_btn.classList.toggle("active");
    menu.classList.toggle("active");
    header_bg.classList.toggle("active");
});
