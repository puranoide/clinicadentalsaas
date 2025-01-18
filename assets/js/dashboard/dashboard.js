function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.getElementById("citas_hoy").value = getTodayDate();

window.onload = function() {
    var citas_hoy = document.getElementById("citas_hoy").value;
    fetch("controllers/citas.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "get_citas",
            citas_hoy: citas_hoy
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Respuesta del servidor:", data);
        // Handle successful login response
        if (data.success) {
            // Redirect or update UI on successful login
            document.getElementById("citas").innerHTML = data.citas;
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