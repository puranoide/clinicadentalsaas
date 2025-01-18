function login(username, password) {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(email, password);
    fetch("controllers/auth.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "login", 
            email: email,
            password: password // Fixed: Send password instead of username
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Respuesta del servidor:", data);
        // Handle successful login response
        if (data.success) {
            // Redirect or update UI on successful login
            window.location.href = "views/dashboard.php"; 
        } else {
            // Show error message
            alert(data.message || "Credenciales incorrectas");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
    });
}
