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
            console.log("Login exitoso");
            console.log(data);
            console.log("Redirigiendo a la vista...");
            window.location.href = "views/dashboard.php";
            console.log("Redirección exitosa");
          } else {
            alert("credenciales Incorrectas");
            console.log("Error en el login");
          }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
    });
}
