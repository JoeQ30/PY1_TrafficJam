
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

//Ejemplo Coordenadas: [0,1]
/**
 * 
 * @param {[int, int]} Coordenadas 
 * @returns carro o -1 en caso de que no haya carro en la posicion
 */
function buscarCarroByCoords(Coordenadas){
    for (var i = 0; i < listCarros.length; i++){
        var carro = listCarros[i];
        for (var j = 0; j < carro.posiciones.length; j++){
            var pos = carro['posiciones'][j];
            if (pos[0] === Coordenadas[0] && pos[1] === Coordenadas[1]){
                return carro;
            }
        }
    }
    return null;
}

/**
 * 
 * @param {int} id 
 * @returns carrro  o -1 si no hay carro con el id
 */
function buscarCarroById(id){
    for (var i = 0; i < listCarros.length; i++){
        var carro = listCarros[i];
        if (carro['id'] === id){
            return carro;
        }
    }
    return null;
}

/**
 * 
 * @param {[int, int]} Coordenadas 
 */
function moverCarro(Coordenadas){
    console.log(Coordenadas);
    var carro = buscarCarroByCoords(Coordenadas);
    if (carro != null) {
        var posicionesCarro = carro['posiciones'];
        var orientacion = carro['orientacion'];
        if (orientacion === 'h'){
            for (var i = 0; i < posicionesCarro.length; i++){
                var pos = posicionesCarro[i];
                pos[1] += 1;
            }
        }else {
            for (var i = 0; i < posicionesCarro.length; i++){
                var pos = posicionesCarro[i];
                pos[0] += 1;
            }
        }
        //Actualizar la posicion
        updateCars();
        generarTablero();
        updateGUI();
       
    } else{
        console.log("Error: No hay ningún carro en esta posicion")
    }
}

//Antes de llamar a esta funcion hay que vaciar e; tablero
/**
 * 
 */
function updateCars(){
    vaciarTablero();
    for (var i = 0; i < listCarros.length; i++){
        var carro = listCarros[i];
        for (var j = 0; j < carro.posiciones.length; j++){
            var pos = carro['posiciones'][j];
            if (carro['orientacion'] === 'h'){
                if(pos === carro['posiciones'][carro['posiciones'].length-1]){
                    if (carro['esObjetivo']){
                        tablero[pos[0]][pos[1]] = 'B';
                    }else{
                        tablero[pos[0]][pos[1]] = '>';
                    }
                }else{
                    tablero[pos[0]][pos[1]] = '-';
                }
                
            }else{
                if(pos === carro['posiciones'][carro['posiciones'].length-1]){
                    if (carro['esObjetivo']){
                        tablero[pos[0]][pos[1]] = 'B';
                    }else{
                        tablero[pos[0]][pos[1]] = 'v';
                    }
                }else{
                    tablero[pos[0]][pos[1]] = '|';
                }
            }
        }
    }
    console.log(tablero);
}

/**
 * 
 */
function updateGUI() {
    for (var i = 0; i < tablero.length; i++) {
        for (var j = 0; j < tablero[i].length; j++) {
            var celda = document.getElementById(`C${i}${j}`);
            var contenido = tablero[i][j];
            var cellClass = '';
            var posCar = [];
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
            }
        }
    }
};

// Función para actualizar la interfaz gráfica basada en el tablero
/**
 * 
 */
function initGUI() {
    var idCar = 1
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
                dicCarro['id'] = idCar;
                idCar += 1;
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
                    dicCarro['id'] = idCar;
                    idCar += 1;
                    //Ej: posCar = [[0,1], [0,2], [0,3], [0,4]]
                    dicCarro['posiciones'] = posCar;  //Se guardan las posiciones de todas las casillas que ocupa el carro
                    dicCarro['orientacion'] = 'v';  //Se guarda la orientación del carro
                    dicCarro['heuristica'] = 0;
                    dicCarro['costoInicial'] = 0;
                    dicCarro['costoTotal'] = 0;
                    dicCarro['esObjetivo'] = isTarget;  //Se guarda si el carro es objetivo
                    dicCarro['padre'] = null;
                    //console.log(dicCarro);
                    listCarros.push(dicCarro);
                }
                
            
            }
        }
    }
    console.log(listCarros);
    //var carroPrueba = buscarCarroByCoords([3,0])
    //console.log(carroPrueba);
    //var posicionesCarro = carroPrueba['posiciones'];
    //carroPrueba = buscarCarroById(4);
    //console.log(carroPrueba);

    //Sumo una casilla hacia abajo a cada coordenada
    //carroPrueba = buscarCarromoverCarro([0,0]);
    //carroPrueba = buscarCarro
    //carroPrueba = buscarCarroupdateCars();
};


/**
 * 
 * @param {list} coords 
 * @returns boolean
 */
function validarCarro(coords) {
    if (listCarros.length > 0 && coords !== undefined) {
        for (let carro of listCarros) {
            // Verificar si coords está presente en carro.posiciones
            var varHeuristica = carro['heuristica'];
            for (let pos of carro.posiciones) {
                if (pos[0] === coords[0] && pos[1] === coords[1]) {
                    return false; // Se encontró una coincidencia
                }
            }
        }
    }
    return true; // No se encontraron coincidencias
}


function vaciarTablero() {
    tablero = [];
    var emptyTable = []
    for (var i = 0; i < filas; i++) {
        var fila = [];
        for (var j = 0; j < columnas; j++) {
            fila.push('.');
        }
        tablero.push(fila);
    }
    //console.log(tablero);
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
            //var coords = [i,j];

            (function(x, y) {
                celda.addEventListener("click", function() {
                    moverCarro([x, y]);
                });
            })(i, j); // Utiliza una función de cierre para crear un ámbito diferente para cada variable coords
           
            //celda.textContent = tablero[i][j]; // Mostramos el contenido del tablero en la celda
            fila.appendChild(celda);
        }

        tableroDOM.appendChild(fila);
    }


    tableroContainer.appendChild(tableroDOM);
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
    //console.log(indexOut_x, indexOut_y)
    //console.log("filas: ", filas);
    //console.log("columnas: ", columnas);
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

