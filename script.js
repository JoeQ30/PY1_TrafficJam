


// Variable global para almacenar el tablero (matriz de juego)
var tablero = [];

var emptyTable = [];

//lista = [[0,1], [0,2], [0,3], [0,4]]
//direction = 'h' //'v'

// Variables globales para almacenar las coordenadas de la salida
var indexOut_x = 0;
var indexOut_y = 0;

//Se inicialixan variables de tamaño del tablero
var filas = 0;
var columnas = 0;

var listCarros = [];

//class Carro {
//    constructor(posiciones, orientacion, heuristica, costoInicial, esObjetivo) {
//        this.posiciones = posiciones || []; 
//        this.orientacion = orientacion; 
//        this.heuristica = heuristica; 
//        this.costoInicial = costoInicial; 
//        this.costoTotal = costoInicial + heuristica; 
//        this.esObjetivo = esObjetivo;
//        this.padre = null; 
//    }
//
//    darPaso(){
//        if (this.orientacion === 'h'){
//            for (var i = 0; i < this.posiciones.length; i++){
//                this.posiciones[i][1] += 1;
//            }
//        }else{
//            for (var i = 0; i < this.posiciones.length; i++){
//                this.posiciones[i][0] += 1;
//            }
//        }
//    }
//
//    toString() {
//        return `Carro: ${this.posiciones}, orientacion: ${this.orientacion}, esObjetivo: ${this.esObjetivo}`;
//    
//    }
//}

function updateCars(){
    tablero = emptyTable;

}

// Función para actualizar la interfaz gráfica basada en el tablero
function initGUI() {
    for (var i = 0; i < tablero.length; i++) {
        for (var j = 0; j < tablero[i].length; j++) {
            var celda = document.getElementById(`C${i}${j}`);
            var contenido = tablero[i][j];
            var cellClass = '';
            var posCar = [];
            var isTarget = false;
            const dicCarro = {}; // Diccionario para guardar los datos del carro
            if (contenido === '-'){
                cellClass = 'car';
                // Buscar hacia la derecha hasta encontrar la flecha o el objetivo
                for (var x = j; x < tablero[i].length; x++) {
                    if (tablero[i][x] === '>' ) {
                        cellClass = 'car';
                        posCar.push([i, x]);
                        break; // Terminar si encontramos la flecha
                    } else if (tablero[i][x] === 'B') {
                        cellClass = 'target'; // Marcar todo el carro objetivo en rojo
                        isTarget = true;
                        posCar.push([i, x]);
                        break; // Terminar si encontramos el objetivo
                    }
                    posCar.push([i, x]); // Guardar coordenadas del carro
                }
                for (var pos in posCar) {
                    var posCelda = document.getElementById(`C${posCar[pos][0]}${posCar[pos][1]}`);
                    posCelda.classList.add(cellClass);
                }
                j = x;
                //console.log(posCar);
                
                dicCarro['posiciones'] = posCar;
                dicCarro['orientacion'] = 'h';
                dicCarro['heuristica'] = 0;
                dicCarro['costoInicial'] = 0;
                dicCarro['costoTotal'] = 0;
                dicCarro['esObjetivo'] = isTarget;
                dicCarro['padre'] = null;
                //console.log(dicCarro);
                listCarros.push(dicCarro);
            }
            //Busca si hay un carro vertical y lo marca como tal
            else if (contenido === '|'){
                cellClass = 'car';
            
                // Buscar hacia la derecha hasta encontrar la flecha o el objetivo
                for (var y = i; y < tablero.length; y++) {
                        if (tablero[y][j] === 'v' ) {
                            cellClass = 'car';
                            posCar.push([y, j]);
                            break; // Terminar si encontramos la flecha
                        }
                        else if (tablero[y][j] === 'B') {
                            cellClass = 'target'; // Marcar todo el carro objetivo en rojo
                            isTarget = true;
                            posCar.push([y, j]);
                            break; // Terminar si encontramos el objetivo
                        } 
                        posCar.push([y, j]); // Guardar coordenadas del carro
                    }
                for (var pos in posCar) {
                    //console.log(posCar);
                    var posCelda = document.getElementById(`C${posCar[pos][0]}${posCar[pos][1]}`);
                    posCelda.classList.add(cellClass);
                }
                //i = y;
                if (posCelda.length !== 0 && validarCarro(posCar[0]) === true){
                    //console.log(posCar);
                    dicCarro['posiciones'] = posCar;
                    dicCarro['orientacion'] = 'v';
                    dicCarro['heuristica'] = 0;
                    dicCarro['costoInicial'] = 0;
                    dicCarro['costoTotal'] = 0;
                    dicCarro['esObjetivo'] = isTarget;
                    dicCarro['padre'] = null;
                    //console.log(dicCarro);
                    listCarros.push(dicCarro);
                }
                
            
            }
        }
    }
    console.log(listCarros);
};


function validarCarro(coords) {
    if (listCarros.length > 0 && coords !== undefined) {
        for (let carro of listCarros) {
            // Verificar si coords está presente en carro.posiciones
            for (let pos of carro.posiciones) {
                if (pos[0] === coords[0] && pos[1] === coords[1]) {
                    return false; // Se encontró una coincidencia
                }
            }
        }
    }
    return true; // No se encontraron coincidencias
}




function generarTableroVacio() {
    for (var i = 0; i < tablero.length; i++) {
        var fila = [];
        for (var j = 0; j < tablero[i].length; j++) {
            fila.push('.');
        }
        emptyTable.push(fila);
    }
    //console.log(emptyTable);
};

function generarTablero() {
    var tableroContainer = document.getElementById("board-container");
    var tableroDOM = document.createElement("table");
    tableroDOM.id = "board";

    tableroDOM.classList.add("tablero2"); // Agregamos la clase "tablero" al tablero

    tableroContainer.style.display = "block"; // Mostramos el contenedor del tablero

    tableroContainer.innerHTML = ""; // Limpiamos el contenedor antes de agregar el tablero

    for (var i = 0; i < tablero.length; i++) {
        var fila = document.createElement("tr");
        fila.classList.add("fila");

        for (var j = 0; j < tablero[i].length; j++) {
            var celda = document.createElement("td");
            if (i == indexOut_y && j == indexOut_x) {
                celda.classList.add("exit");
            }else{
                celda.classList.add("celda");
            }
            
            celda.id = `C${i}${j}`;
            celda.textContent = tablero[i][j]; // Mostramos el contenido del tablero en la celda
            fila.appendChild(celda);
        }

        tableroDOM.appendChild(fila);
    }


    tableroContainer.appendChild(tableroDOM);
    generarTableroVacio();
};

// Función para parsear el tablero y mostrarlo en la página
function parseBoard() {
    var userInput = document.getElementById("board-input").value.trim();
    
    // Encontrar la posiciÃ³n de la palabra "Salida:"
    var exitIndex = userInput.indexOf("Salida:");
    var boardInput = userInput.substring(0, exitIndex).trim();
    var exitInput = userInput.substring(exitIndex + 7).trim(); // Longitud de "Salida:"

    // Obtener las coordenadas de la salida
    var exitCoords = exitInput.split(',');
    indexOut_x = parseInt(exitCoords[0].trim());
    indexOut_y = parseInt(exitCoords[1].trim());

    // Parsear el tablero visualmente
    var targetOrientation = true;
    var boardRows = boardInput.split('\n');
    console.log(boardRows);
    boardRows.forEach((row, rowIndex) => {
        var rowArray = [];
        row.trim().split('').forEach((cell, cellIndex) => {
            if (cell !== ' ') { // Ignorar los espacios en blanco
                var cellClass = '';
                if (cell === '-') {
                    cellClass = 'car horizontal';
                    // Buscar hacia la derecha hasta encontrar la flecha o el objetivo
                    for (var i = cellIndex + 1; i < row.length; i++) {
                        if (row[i] === '>') {
                            cellClass = 'car horizontal';
                            break; // Terminar si encontramos la flecha
                        }
                        if (row[i] === 'B') {
                            cellClass = 'target horizontal'; // Marcar todo el carro objetivo en rojo
                            targetOrientation = true;
                            break; // Terminar si encontramos el objetivo
                        }
                    }
                } else if (cell === '|') {
                    cellClass = 'car vertical';
                    // Buscar hacia abajo hasta encontrar la flecha o el objetivo
                    for (var i = rowIndex + 1; i < boardRows.length; i++) {
                        var nextRow = boardRows[i].trim();
                        if (nextRow[cellIndex] === 'v') {
                            cellClass = 'car vertical';
                            break; // Terminar si encontramos la flecha
                        }
                        if (nextRow[cellIndex] === 'B') {
                            cellClass = 'target vertical'; // Marcar todo el carro objetivo en rojo
                            targetOrientation = false;
                            break; // Terminar si encontramos el objetivo
                        }
                        nextRow = nextRow.substring(0, cellIndex) + '|' + nextRow.substring(cellIndex + 1); // Marcar la celda como parte del carro
                        boardRows[i] = nextRow;
                    }
                } else if (cell === 'B') {
                    if (targetOrientation) {
                        cellClass = 'target horizontal';
                    } else {
                        cellClass = 'target vertical'
                    }
                } else if (cell === 'v') {
                    cellClass = 'car vertical';
                } else if (cell === '>') {
                    cellClass = 'car horizontal';
                } else if (cell === '.') {
                    cellClass = 'empty';
                }
                rowArray.push(cell);
            }
        });

        tablero.push(rowArray); // Agregar la fila a la matriz del tablero
    });
    
    filas = tablero.length;
    columnas = tablero[0].length;
    console.log(indexOut_x, indexOut_y)
    console.log("filas: ", filas);
    console.log("columnas: ", columnas);
    //console.log(tablero);
    generarTablero();
    initGUI();
};

// Función para permitir que los elementos se puedan arrastrar
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}




//-------------------------------------------------------------------------------------------------------------------
//                                      IMPLEMENTACION DE ALGORITMOS
//-------------------------------------------------------------------------------------------------------------------





/**
 * 
 * @param {Carro} nodo 
 * @param {Coordenadas x,y} destino 
 * @returns El camino utilizando la distancia Manhattan 
 */
function calcularHeuristica(nodo, destino) {
    return Math.abs(nodo.x - destino.x) + Math.abs(nodo.y - destino.y);
}

/**
 * 
 * @param {Carro} nodoActual 
 * @param {Tablero} matriz 
 * @param {Coordenadas x,y} destino 
 * @returns Array de todos los carros adyacentes
 */
function generarSucesores(carroActual, matriz, destino) {
    const sucesores = [];
    const movimientos = [[-1, 0], [0, -1], [1, 0], [0, 1]]; // Movimientos posibles: arriba, izquierda, abajo, derecha

    for (const movimiento of movimientos) {
        const fila = carroActual.x + movimiento[0];
        const columna = carroActual.y + movimiento[1];

        // Verificar si el sucesor está dentro de los límites de la matriz
        if (fila >= 0 && columna >= 0 && fila < matriz.length && columna < matriz[0].length) {
            // Verificar si el sucesor es un espacio válido
            if (matriz[fila][columna] !== "B") { // Ojo aqui tengo a B como obstaculo en la matriz. CAMBIAR DE SER NECESARIO
                const g = carroActual.g + 1; // Costo de movimiento, los costos son de 1
                const h = calcularHeuristica({x: fila, y: columna}, destino);
                sucesores.push(new Carro(fila, columna, g, h));
            }
        }
    }

    return sucesores;
}


function esSolucion(nodoActual, destino, camino){
    if (nodoActual.x === destino[0] && nodoActual.y === destino[1]) {
        let nodo = nodoActual;
        while (nodo) {
            camino.push([nodo.x, nodo.y]);
            nodo = nodo.padre;
        }
        return true;
    }


}
/**
 * 
 * @param {Tablero} matriz 
 * @param {Carro objetivo} inicio 
 * @param {Salida} destino 
 * @returns 
 */
function aEstrella(matriz, inicio, destino) {
    const abierto = []; 
    const cerrado = []; // Nodos que ya hemos visitado por cada llamada 

    abierto.push(new Carro(inicio[0], inicio[1], 0, calcularHeuristica({x: inicio[0], y: inicio[1]}, {x: destino[0], y: destino[1]})));

    while (abierto.length > 0) {
        let nodoActual = abierto[0];
        let indiceActual = 0;

        // Encontrar el nodo con el valor f mínimo en el conjunto abierto
        for (let i = 1; i < abierto.length; i++) {
            if (abierto[i].f < nodoActual.f) {
                nodoActual = abierto[i];
                indiceActual = i;
            }
        }

        // Mover el nodo actual del conjunto abierto al conjunto cerrado
        abierto.splice(indiceActual, 1); // Lo elimina de abierto
        cerrado.push(nodoActual); // Lo pasa como cerrado

        // Verificar si hemos llegado al destino

        const camino = []
        if (esSolucion(nodoActual, destino, camino)){
            return camino.reverse();
        }

        // Generar sucesores del nodo actual
        const sucesores = generarSucesores(nodoActual, matriz, destino);

        for (const sucesor of sucesores) {
            // Verificar si el sucesor está en el conjunto cerrado
            if (cerrado.find(n => n.x === sucesor.x && n.y === sucesor.y)) {
                continue;
            }

            // Verificar si el sucesor está en el conjunto abierto y tiene un valor f menor
            const nodoAbierto = abierto.find(n => n.x === sucesor.x && n.y === sucesor.y);
            if (nodoAbierto && sucesor.f >= nodoAbierto.f) {
                continue;
            }

            // Establecer el nodo actual como el padre del sucesor
            sucesor.padre = nodoActual;

            // Agregar el sucesor al conjunto abierto si no está allí
            if (!nodoAbierto) {
                abierto.push(sucesor);
            }
        }
    }

    // Si no se puede encontrar un camino, devolver null
    return null;
}

