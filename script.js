
// Variable global para almacenar el tablero (matriz de juego)
var tablero = [];

//posiciones = [[0,1], [0,2], [0,3], [0,4]]
//direction = 'h' //'v'

// Variables globales para almacenar las coordenadas de la salida
var indexOut_x = 0;
var indexOut_y = 0;

//Se inicialixan variables de tamaño del tablero
var filas = 0;
var columnas = 0;

var listCarros = []; //Aqui estaran todos los diccionarios Carro

var contadorMovimientos = 0;
var movimientosDiv = document.getElementById("movimientos");
//Ejemplo Coordenadas: [0,1]
/**
 * 
 * @param {[int, int]} coordenadas 
 * @returns carro o -1 en caso de que no haya carro en la posicion
 */
function buscarCarroByCoords(coordenadas) {
    for (var i = 0; i < listCarros.length; i++) {
        var carro = listCarros[i]; //Se asigna el carro posicion i
        for (var j = 0; j < carro.posiciones.length; j++) {
            var pos = carro['posiciones'][j];    // Se obtiene la posicion j de carro i
            if (pos[0] === coordenadas[0] && pos[1] === coordenadas[1]) {
                return carro;   //Si es el carro buscado se retorna dicho carro
            }
        }
    }
    return null;  //Si no se encuentra el carro se retorna nulo
}

/**
 * @param {[number, number]} coordenadas
 * @returns {array<[number, number]>} carro
 */
function buscarCarroByCoordsDFS(coordenadas) {
    for (let i = 0; i < listCarros.length; i++) {
        let carro = listCarros[i];
        if (dfs(carro, coordenadas)) {
            return carro;
        }
    }
    return null;
}

/**
 * @param {object} carro
 * @param {[number, number]} x, y
 * @param {number?} index
 * @returns {string} secuencia de acciones para alcanzar la salida
 */
function dfs(carro, [y, x], index = 0, acciones = "") {
    var inicio = performance.now();
    if (index >= carro.posiciones.length) {
        return acciones;
    }

    let [y1, x1] = carro.posiciones[index];
    if (y === y1 && x === x1) {
        // Calcular los movimientos necesarios para llegar a la salida
        let movimientosX = indexOut_x - x;
        let movimientosY = indexOut_y - y;
        let movimiento = "";

        if (movimientosX > 0) {
            movimiento = "hacia la derecha";
        } else if (movimientosX < 0) {
            movimiento = "hacia la izquierda";
        } else if (movimientosY > 0) {
            movimiento = "hacia abajo";
        } else if (movimientosY < 0) {
            movimiento = "hacia arriba";
        }

        // Agregar el movimiento a la secuencia de acciones
        acciones += `Mover carro ${carro.id} ${Math.abs(movimientosX) + Math.abs(movimientosY)} casillas ${movimiento}\n`;
        var accionesDiv = document.getElementById("acciones");
        accionesDiv.innerHTML = acciones;
        return acciones;
    }

    var fin = performance.now(); // Momento final
    var tiempoTranscurrido = fin - inicio;
    var tiempoEjecucionDiv = document.getElementById("tiempo-ejecucion");
    tiempoEjecucionDiv.innerHTML = "Tiempo de ejecución: " + tiempoTranscurrido.toFixed(2) + " milisegundos";

    return dfs(carro, [y, x], index + 1, acciones);
}

/**
 * 
 * @param {int} id 
 * @returns carrro  o -1 si no hay carro con el id
 */
function buscarCarroById(id) {
    for (var i = 0; i < listCarros.length; i++) {
        var carro = listCarros[i];
        if (carro['id'] === id) {
            return carro;
        }
    }
    return null;
}

/**
 * Returns the minimum of 2 values
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function min(a, b) {
    if (a < b) {
        return a;
    }
    return b;
}

/**
* @param {[number, number]} celda
* @param {"h"|"v"} direccion
* @returns {boolean}
*/
function validarMovimiento(celda, direccion) {
    let [y, x] = [min(celda[0], filas - 1), min(celda[1], columnas - 1)];
    let code = direccion === 'h' ? `C${y}${x + 1}` : `C${y + 1}${x}`;
    let nextCell = document.getElementById(code);
    let cellAtTail = document.getElementById(`C${y}${x}`);
    if (cellAtTail.classList.contains('exit')) return true;
    if (!nextCell) return false;
    return !(nextCell.classList.contains('car') || nextCell.classList.contains('target'));
}

/**
 * 
 * @param {[int, int]} coordenadas 
 */
function moverCarro(coordenadas) {
    var carro = buscarCarroByCoordsDFS(coordenadas); //Se obtiene el carro que se encuentra en las coordenadas
    if (carro != null) {
        var posicionesCarro = carro['posiciones'];  //Se obtiene la lista de celdas que componen al carro
        var orientacion = carro['orientacion'];     //Se obtiene la orientacion del carro
        if (orientacion === 'h') {
            let head = posicionesCarro[posicionesCarro.length - 1];  //Se obtiene la cabeza del carro
            if (validarMovimiento(head, 'h')) {
                for (let i = 0; i < posicionesCarro.length; i++) {
                    let currentPosition = posicionesCarro[i];       //Se recorren todas las posiciones de la lista de coordenadas
                    if (currentPosition[1] < columnas - 1)
                        currentPosition[1] += 1;                    //Si es válido se le suma 1 a la columna a cada posición de la lista
                }
            };
        } else {
            let head = posicionesCarro[posicionesCarro.length - 1];     //Se obtiene la cabeza del carro
            if (validarMovimiento(head, 'v')) {
                for (let i = 0; i < posicionesCarro.length; i++) {      
                    let currentPosition = posicionesCarro[i];           //Se recorren todas las posiciones de la lista de coordenadas
                    if (currentPosition[0] < filas - 1)
                        currentPosition[0] += 1;                        //Si es válido se le suma 1 a la fila a cada posición de la lista
                }
            };
        }
        //Actualizar la posicion
        updateCars();                   //Se colocan todos los carros en una nueva matriz
        updateGUI();                    //Se actualiza la GUI con la nueva matriz
        contadorMovimientos +=1;        //Se aumenta el contador de movimientos
        movimientosDiv.innerHTML = "Movimientos: " + contadorMovimientos;
    } else {
        console.error("No hay ningún carro en esta posicion")
    }
}


/**
 * Actualiza el estado del tablero con la posición actual de los carros.
 * Vacía el tablero, luego itera sobre cada carro en la lista de carros
 * y actualiza las posiciones de los carros en el tablero según su orientación
 * y si son objetivos o no.
 */
function updateCars() {
    vaciarTablero(); // Vacía el tablero
    // Itera sobre cada carro en la lista de carros
    for (var i = 0; i < listCarros.length; i++) {
        var carro = listCarros[i];
        // Itera sobre cada posición del carro
        for (var j = 0; j < carro.posiciones.length; j++) {
            var pos = carro['posiciones'][j];
            // Verifica la orientación del carro
            if (carro['orientacion'] === 'h') {
                // Si la posición es la última del carro
                if (pos === carro['posiciones'][carro['posiciones'].length - 1]) {
                    // Si el carro es objetivo, actualiza la posición con 'B', de lo contrario '>'
                    tablero[pos[0]][pos[1]] = carro['esObjetivo'] ? 'B' : '>';
                } else {
                    // Si no es la última posición, actualiza con '-'
                    tablero[pos[0]][pos[1]] = '-';
                }
            } else {
                // Si la posición es la última del carro
                if (pos === carro['posiciones'][carro['posiciones'].length - 1]) {
                    // Si el carro es objetivo, actualiza la posición con 'B', de lo contrario 'v'
                    tablero[pos[0]][pos[1]] = carro['esObjetivo'] ? 'B' : 'v';
                } else {
                    // Si no es la última posición, actualiza con '|'
                    tablero[pos[0]][pos[1]] = '|';
                }
            }
        }
    }
}


/**
 * Actualiza la interfaz gráfica basada en el estado actual del tablero.
 * Genera el tablero visualmente y marca las celdas ocupadas por los carros
 * con las clases CSS correspondientes.
 */
function updateGUI() {
    generarTablero(); // Genera el tablero visualmente
    // Itera sobre cada fila y columna del tablero
    for (var i = 0; i < tablero.length; i++) {
        for (var j = 0; j < tablero[i].length; j++) {
            var celda = document.getElementById(`C${i}${j}`); // Obtiene la celda correspondiente del DOM
            var contenido = tablero[i][j]; // Obtiene el contenido de la celda del tablero
            var cellClass = ''; // Clase CSS de la celda
            var posCar = []; // Array para almacenar las posiciones del carro

            // Si el contenido de la celda es '-', se marca como un carro horizontal
            if (contenido === '-') {
                cellClass = 'car';
                // Busca hacia la derecha hasta encontrar la flecha o el objetivo
                for (var x = j; x < tablero[i].length; x++) {
                    if (tablero[i][x] === '>') {
                        cellClass = 'car';
                        posCar.push([i, x]);
                        break; // Termina si encuentra la flecha
                    } else if (tablero[i][x] === 'B') {
                        cellClass = 'target'; // Marca todo el carro objetivo en rojo
                        posCar.push([i, x]);
                        break; // Termina si encuentra el objetivo
                    }
                    posCar.push([i, x]); // Guarda coordenadas del carro
                }
                // Agrega la clase CSS al elemento de la celda
                for (const [x, y] of posCar) {
                    var posCelda = document.getElementById(`C${x}${y}`);
                    posCelda.classList.add(cellClass);
                }
                j = x; // Actualiza la posición de la columna
            }
            // Si el contenido de la celda es '|', se marca como un carro vertical
            else if (contenido === '|') {
                cellClass = 'car';

                // Busca hacia abajo hasta encontrar la flecha o el objetivo
                for (var y = i; y < tablero.length; y++) {
                    if (tablero[y][j] === 'v') {
                        cellClass = 'car';
                        posCar.push([y, j]);
                        break; // Termina si encuentra la flecha
                    }
                    else if (tablero[y][j] === 'B') {
                        cellClass = 'target'; // Marca todo el carro objetivo en rojo
                        posCar.push([y, j]);
                        break; // Termina si encuentra el objetivo
                    }
                    posCar.push([y, j]); // Guarda coordenadas del carro
                }
                // Agrega la clase CSS al elemento de la celda
                for (var pos in posCar) {
                    var posCelda = document.getElementById(`C${posCar[pos][0]}${posCar[pos][1]}`);
                    posCelda.classList.add(cellClass);
                }
            }
        }
    }
}

 
/**
 * Inicializa la interfaz gráfica del juego basada en el tablero proporcionado.
 * Crea los elementos visuales correspondientes a cada celda del tablero y marca
 * las celdas ocupadas por los carros con las clases CSS adecuadas.
 */
function initGUI() {
    var idCar = 1; // Identificador único para cada carro
    // Itera sobre cada fila y columna del tablero
    for (var i = 0; i < tablero.length; i++) {
        for (var j = 0; j < tablero[i].length; j++) {
            var contenido = tablero[i][j]; // Contenido de la celda del tablero
            var cellClass = ''; // Clase CSS de la celda
            var posCar = []; // Array para almacenar las posiciones del carro
            var isTarget = false; // Indica si el carro es un objetivo
            const dicCarro = {}; // Diccionario para guardar los datos del carro

            // Si el contenido de la celda es '-', se marca como un carro horizontal
            if (contenido === '-') {
                cellClass = 'car';
                // Busca hacia la derecha hasta encontrar la flecha o el objetivo
                for (var x = j; x < tablero[i].length; x++) {
                    if (tablero[i][x] === '>') {
                        cellClass = 'car';
                        posCar.push([i, x]);
                        break; // Termina si encuentra la flecha
                    } else if (tablero[i][x] === 'B') {
                        cellClass = 'target'; // Marca todo el carro objetivo en rojo
                        isTarget = true;
                        posCar.push([i, x]);
                        break; // Termina si encuentra el objetivo
                    }
                    posCar.push([i, x]); // Guarda coordenadas del carro
                }
                // Agrega la clase CSS al elemento de la celda
                for (var pos in posCar) {
                    var posCelda = document.getElementById(`C${posCar[pos][0]}${posCar[pos][1]}`);
                    posCelda.classList.add(cellClass);
                }
                j = x; // Actualiza la posición de la columna

                // Guarda los datos del carro en el diccionario y lo añade a la lista de carros
                dicCarro['id'] = idCar;
                idCar += 1;
                dicCarro['posiciones'] = posCar;
                dicCarro['orientacion'] = 'h';
                dicCarro['heuristica'] = 0;
                dicCarro['costoInicial'] = 0;
                dicCarro['costoTotal'] = 0;
                dicCarro['esObjetivo'] = isTarget;
                dicCarro['padre'] = null;
                listCarros.push(dicCarro);
            }
            // Si el contenido de la celda es '|', se marca como un carro vertical
            else if (contenido === '|') {
                cellClass = 'car';

                // Busca hacia abajo hasta encontrar la flecha o el objetivo
                for (var y = i; y < tablero.length; y++) {
                    if (tablero[y][j] === 'v') {
                        cellClass = 'car';
                        posCar.push([y, j]);
                        break; // Termina si encuentra la flecha
                    }
                    else if (tablero[y][j] === 'B') {
                        cellClass = 'target'; // Marca todo el carro objetivo en rojo
                        isTarget = true;
                        posCar.push([y, j]);
                        break; // Termina si encuentra el objetivo
                    }
                    posCar.push([y, j]); // Guarda coordenadas del carro
                }
                // Agrega la clase CSS al elemento de la celda
                for (var pos in posCar) {
                    var posCelda = document.getElementById(`C${posCar[pos][0]}${posCar[pos][1]}`);
                    posCelda.classList.add(cellClass);
                }
                // Si la longitud de posCelda es diferente de 0 y el carro es válido, se guarda en la lista de carros
                if (posCelda.length !== 0 && validarCarro(posCar[0]) === true) {
                    dicCarro['id'] = idCar;
                    idCar += 1;
                    dicCarro['posiciones'] = posCar;  // Se guardan las posiciones de todas las casillas que ocupa el carro
                    dicCarro['orientacion'] = 'v';  // Se guarda la orientación del carro
                    dicCarro['heuristica'] = 0;
                    dicCarro['costoInicial'] = 0;
                    dicCarro['costoTotal'] = 0;
                    dicCarro['esObjetivo'] = isTarget;  // Se guarda si el carro es objetivo
                    dicCarro['padre'] = null;
                    listCarros.push(dicCarro);
                }
            }
        }
    }
}

/**
 * Valida si una posición de coordenadas está ocupada por algún carro en la lista de carros.
 * @param {Array} coords - Coordenadas [fila, columna] a validar.
 * @returns {boolean} Devuelve true si la posición está libre, false si está ocupada por un carro.
 */
function validarCarro(coords) {
    // Verifica si las coordenadas no son undefined y si la lista de carros tiene elementos
    if (coords !== undefined && listCarros.length > 0) {
        // Itera sobre cada carro en la lista de carros
        for (let carro of listCarros) {
            // Itera sobre las posiciones ocupadas por el carro actual
            for (let pos of carro.posiciones) {
                // Comprueba si las coordenadas coinciden con alguna posición ocupada por el carro
                if (pos[0] === coords[0] && pos[1] === coords[1]) {
                    return false; // La posición está ocupada por un carro
                }
            }
        }
    }
    return true; // La posición está libre
}



/**
 * Vacía el tablero, rellenándolo con puntos ('.') en todas las celdas.
 */
function vaciarTablero() {
    tablero = []; // Reinicia el tablero vaciándolo completamente
    // Itera sobre cada fila del tablero
    for (var i = 0; i < filas; i++) {
        var fila = [];
        // Itera sobre cada columna de la fila actual
        for (var j = 0; j < columnas; j++) {
            fila.push('.'); // Rellena la celda con un punto ('.')
        }
        tablero.push(fila); // Agrega la fila al tablero
    }
}



/**
 * Genera y muestra el tablero en la interfaz gráfica.
 * Cada celda del tablero es representada por un elemento <td> en una tabla <table>.
 * Se asignan clases y eventos a las celdas según su contenido y posición.
 */
function generarTablero() {
    var tableroContainer = document.getElementById("board-container"); // Obtiene el contenedor del tablero
    var tableroDOM = document.createElement("table"); // Crea un elemento de tabla para representar el tablero
    tableroDOM.id = "board"; // Asigna un ID al tablero

    tableroDOM.classList.add("tablero2"); // Agrega la clase "tablero2" al tablero

    tableroContainer.style.display = "block"; // Muestra el contenedor del tablero

    tableroContainer.innerHTML = ""; // Limpia el contenedor antes de agregar el tablero

    // Itera sobre cada fila del tablero
    for (var i = 0; i < tablero.length; i++) {
        var fila = document.createElement("tr"); // Crea una fila para la tabla
        fila.classList.add("fila"); // Agrega la clase "fila" a la fila

        // Itera sobre cada columna de la fila actual
        for (var j = 0; j < tablero[i].length; j++) {
            var celda = document.createElement("td"); // Crea una celda para la tabla
            // Si la celda es la salida, agrega la clase "exit"; de lo contrario, agrega la clase "celda"
            celda.classList.add((i == indexOut_y - 1 && j == indexOut_x - 1) ? "exit" : "celda");
            celda.id = `C${i}${j}`; // Asigna un ID único a la celda basado en su posición
            // Asigna un evento de clic a la celda para llamar a la función moverCarro con las coordenadas de la celda
            (function(x, y) {
                celda.addEventListener("click", function() {
                    moverCarro([x, y]);
                });
            })(i, j); // Utiliza una función de cierre para crear un ámbito diferente para cada par de coordenadas

            fila.appendChild(celda); // Agrega la celda a la fila
        }

        tableroDOM.appendChild(fila); // Agrega la fila al tablero
    }

    tableroContainer.appendChild(tableroDOM); // Agrega el tablero completo al contenedor
}


/**
 * Parsea la entrada del tablero desde un campo de texto en la interfaz gráfica.
 * Luego, muestra el tablero parseado en la página web.
 */
function parseBoard() {
    var userInput = document.getElementById("board-input").value.trim(); // Obtiene la entrada del tablero del campo de texto

    // Encuentra la posición de la palabra "Salida:"
    var exitIndex = userInput.indexOf("Salida:");
    var boardInput = userInput.substring(0, exitIndex).trim(); // Obtiene la entrada del tablero antes de "Salida:"
    var exitInput = userInput.substring(exitIndex + 7).trim(); // Longitud de "Salida:"

    // Obtiene las coordenadas de la salida
    var exitCoords = exitInput.split(',');
    indexOut_x = parseInt(exitCoords[0].trim());
    indexOut_y = parseInt(exitCoords[1].trim());

    // Parsea visualmente el tablero
    var targetOrientation = true; // Orientación predeterminada de los objetivos
    var boardRows = boardInput.split('\n'); // Divide la entrada del tablero en filas
    boardRows.forEach((row, rowIndex) => {
        var rowArray = []; // Array para almacenar las celdas de la fila
        row.trim().split('').forEach((cell, cellIndex) => {
            if (cell !== ' ') { // Ignora los espacios en blanco
                var cellClass = ''; // Clase de la celda
                if (cell === '-') { // Si la celda es un carro horizontal
                    cellClass = 'car horizontal';
                    // Busca hacia la derecha hasta encontrar la flecha o el objetivo
                    for (var i = cellIndex + 1; i < row.length; i++) {
                        if (row[i] === '>') {
                            cellClass = 'car horizontal';
                            break; // Termina si encuentra la flecha
                        }
                        if (row[i] === 'B') {
                            cellClass = 'target horizontal'; // Marca el carro objetivo en rojo
                            targetOrientation = true;
                            break; // Termina si encuentra el objetivo
                        }
                    }
                } else if (cell === '|') { // Si la celda es un carro vertical
                    cellClass = 'car vertical';
                    // Busca hacia abajo hasta encontrar la flecha o el objetivo
                    for (var i = rowIndex + 1; i < boardRows.length; i++) {
                        var nextRow = boardRows[i].trim();
                        if (nextRow[cellIndex] === 'v') {
                            cellClass = 'car vertical';
                            break; // Termina si encuentra la flecha
                        }
                        if (nextRow[cellIndex] === 'B') {
                            cellClass = 'target vertical'; // Marca el carro objetivo en rojo
                            targetOrientation = false;
                            break; // Termina si encuentra el objetivo
                        }
                        nextRow = nextRow.substring(0, cellIndex) + '|' + nextRow.substring(cellIndex + 1); // Marca la celda como parte del carro
                        boardRows[i] = nextRow;
                    }
                } else if (cell === 'B') { // Si la celda es un objetivo
                    if (targetOrientation) {
                        cellClass = 'target horizontal';
                    } else {
                        cellClass = 'target vertical'
                    }
                } else if (cell === 'v') { // Si la celda es un carro vertical
                    cellClass = 'car vertical';
                } else if (cell === '>') { // Si la celda es un carro horizontal
                    cellClass = 'car horizontal';
                } else if (cell === '.') { // Si la celda está vacía
                    cellClass = 'empty';
                }
                rowArray.push(cell); // Agrega la celda al array de la fila
            }
        });

        tablero.push(rowArray); // Agrega la fila a la matriz del tablero
    });

    filas = tablero.length; // Actualiza el número de filas
    columnas = tablero[0].length; // Actualiza el número de columnas
    generarTablero(); // Genera el tablero en la interfaz gráfica
    initGUI(); // Inicializa la interfaz gráfica del tablero
}


//-------------------------------------------------------------------------------------------------------------------
//                                      IMPLEMENTACION DE ALGORITMOS
//-------------------------------------------------------------------------------------------------------------------





/**
 * El camino utilizando la distancia Manhattan
 * @param {Carro} nodo 
 * @param {Coordenadas x,y} destino 
 * @returns {number}
 */
function calcularHeuristica(nodo, destino) {
    return Math.abs(nodo.x - destino.x) + Math.abs(nodo.y - destino.y);
}

/**
 * 
 * @param {Carro} carro en la posicion actual
 * @param {Tablero} matriz 
 * @param {Coordenadas x,y} destino 
 * @returns Array de todos los carros adyacentes
 */
function generarSucesores(carroActual, matriz, destino) {
    const sucesores = [];
    const movimientos = [[-1, 0], [0, -1], [1, 0], [0, 1]]; // Movimientos posibles: arriba, izquierda, abajo, derecha depende de la variable 

    for (const movimiento of movimientos) {
        const fila = carroActual.x + movimiento[0];
        const columna = carroActual.y + movimiento[1];

        // Verificar si el sucesor está dentro de los límites de la matriz
        if (fila >= 0 && columna >= 0 && fila < matriz.length && columna < matriz[0].length) {
            // Verificar si el sucesor es un espacio válido
            if (matriz[fila][columna] !== "B") { // Ojo aqui tengo a B como obstaculo en la matriz. CAMBIAR DE SER NECESARIO
                const g = carroActual.g + 1; // Costo de movimiento, los costos son de 1
                const h = calcularHeuristica({ x: fila, y: columna }, destino);
                sucesores.push(new Carro(fila, columna, g, h));
            }
        }
    }
    return sucesores;
}

/**
 * 
 * @param {*} nodoActual 
 * @param {*} destino posicion de la casilla de destino
 * @param {*} camino una lista que contiene las posiciones simbolizado el camino
 * @returns true si encontro la solucion, false sino
 */
function esSolucion(nodoActual, destino, camino){
    if (nodoActual.x === destino[0] && nodoActual.y === destino[1]) {
        let nodo = nodoActual;
        while (nodo) {
            camino.push([nodo.x, nodo.y]);
            nodo = nodo.padre;
        }
        return true;
    }
    return false;

}
/**
 * Funcion general del algoritmo de A*
 * @param {Tablero} matriz 
 * @param {Carro objetivo} inicio 
 * @param {Salida} destino 
 * @returns {array?}
 */
function aEstrella(matriz, inicio, destino) {
    var inicio = performance.now();
    const abierto = [];
    const cerrado = []; // Nodos que ya hemos visitado por cada llamada 


    
    abierto.push(
        new Carro(inicio[0], inicio[1], 0, calcularHeuristica({x: inicio[0], y: inicio[1]}, {x: destino[0], y: destino[1]})),
        dicCarro['posiciones'] = posCar,  //Se guardan las posiciones de todas las casillas que ocupa el carro
        dicCarro['heuristica'] = calcularHeuristica,
        dicCarro['costoInicial'] = 0,
        dicCarro['costoTotal'] = 0,
        dicCarro['esObjetivo'] = isTarget,  //Se guarda si el carro es objetivo
        dicCarro['padre'] = null,
        dicCarro['orientacion'] = 'v',  //Se guarda la orientación del carro
    
    );

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
        if (esSolucion(nodoActual, destino, camino)) {
            var fin = performance.now(); 
            var tiempoTranscurrido = fin - inicio;
            var tiempoEjecucionDiv = document.getElementById("tiempo-ejecucion");
            tiempoEjecucionDiv.innerHTML = "Tiempo de ejecución: " + tiempoTranscurrido.toFixed(2) + " milisegundos";
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

