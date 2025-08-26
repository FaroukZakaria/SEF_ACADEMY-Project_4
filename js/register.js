let registerBtn = document.getElementById("registerBtn");
let firstName = document.getElementById("first-name");
let lastName = document.getElementById("last-name");
let email = document.getElementById("email");
let password = document.getElementById("password");
registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!firstName.value || !email.value || !password.value) {
        alert("Please fill all requirements");
        return;
    } else {
        let user = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registration successful!");
        window.location.href = "login.html";
    }
});