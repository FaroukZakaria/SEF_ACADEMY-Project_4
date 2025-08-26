let loginBtn = document.getElementById("loginBtn");
let email = document.getElementById("email");
let password = document.getElementById("password");
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!email.value || !password.value) {
        alert("Please fill all requirements");
        return;
    } else {
        let storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            alert("No user registered. Please register first.");
            return;
        } else if (storedUser.email !== email.value || storedUser.password !== password.value) {
            alert("Invalid email or password. Please try again.");
            return;
        } else {
            localStorage.setItem("loggedInUser", "true");
            alert("Login successful!");
            window.location.href = "index.html";
        }
    }
});