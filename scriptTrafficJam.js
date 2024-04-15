

function ClickPlay(action){
    console.log("Se inicia el Juego!")
};

function generarTablero(action) {
    var filas = parseInt(document.getElementById("input1").value);
    var columnas = parseInt(document.getElementById("input2").value);
    var formulario = document.getElementById("idFormaulario");
    var tableroContainer = document.getElementById("idTableroContainer");
    var tablero = document.getElementById("idTablero2");

    if (!isNaN(filas) && !isNaN(columnas)) {
        
        formulario.style.display = "none"; // Ocultamos el formulario
        tableroContainer.style.display = "block"; // Mostramos el contenedor del tablero

        tableroContainer.innerHTML = ""; // Limpiamos el contenedor antes de agregar el tablero

        for (var i = 0; i < filas; i++) {
            var fila = document.createElement("tr");
            fila.classList.add("fila");

            for (var j = 0; j < columnas; j++) {
                var celda = document.createElement("td");
                celda.classList.add("celda");
                celda.id = `C${i}${j}`;
                
                //celda.addEventListener('click', function() { action(celda.id, filas, columnas); });
                fila.appendChild(celda);
            }

            tablero.appendChild(fila);
        }

        tableroContainer.appendChild(tablero);
    } else {
        alert("Por favor, ingrese números válidos para las filas y columnas.");
    }
};