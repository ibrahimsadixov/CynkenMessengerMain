const more = document.getElementById("more");
const moreDiv = document.querySelector(".moreDiv");
const logOut = document.getElementById("logOut");

more.addEventListener("click", (event) => {
    event.stopPropagation(); 
    moreDiv.classList.toggle("moreDivActive");
});

logOut.addEventListener("click", () => {
    localStorage.removeItem("usernameMessage");
    localStorage.removeItem("passwordMessage");
    window.location.href = "index.htm";
});

document.addEventListener("click", (event) => {
    const target = event.target;

    if (!moreDiv.contains(target) && target !== more) {
        moreDiv.classList.remove("moreDivActive");
    }
});
