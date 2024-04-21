
// Variable global para almacenar el tablero (matriz de juego)
let tablero = [];

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
        var carro = listCarros[i]; //Se asigna el carro posicion i
        for (var j = 0; j < carro.posiciones.length; j++){
            var pos = carro['posiciones'][j];    // Se obtiene la posicion j de carro i
            if (pos[0] === Coordenadas[0] && pos[1] === Coordenadas[1]){
                return carro;   //Si es el carro buscado se retorna dicho carro
            }
        }
    }
    return null;  //Si no se encuentra el carro se retorna nulo
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
                if(pos[1] < columnas-1){
                    pos[1] += 1;
                }
            }
        }else {
            for (var i = 0; i < posicionesCarro.length; i++){
                var pos = posicionesCarro[i];
                if(pos[0] < filas){
                    pos[0] += 1;
                }
            }
        }
        //Actualizar la posicion
        updateCars();
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
    generarTablero();
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
                dicCarro['costoTotal'] = dicCarro.costoInicial + dicCarro.heuristica;
                dicCarro['esObjetivo'] = isTarget;
                dicCarro['direccion'] = "";
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
                    dicCarro['costoTotal'] = dicCarro.costoInicial + dicCarro.heuristica;
                    dicCarro['esObjetivo'] = isTarget;  //Se guarda si el carro es objetivo
                    dicCarro['direccion'] = "";
                    dicCarro['padre'] = null;
                    //console.log(dicCarro);
                    listCarros.push(dicCarro);
                }
            }
        }
    }
    console.log(listCarros);
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
            if (i == indexOut_y-1 && j == indexOut_x-1) {
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
    console.log(aEstrella([4,6]));
};

// Función para permitir que los elementos se puedan arrastrar
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}




//-------------------------------------------------------------------------------------------------------------------
//                                      IMPLEMENTACION DE ALGORITMOS
//-------------------------------------------------------------------------------------------------------------------

/**
 *  Funcion que retorna el carro objetivo
 * @returns El diccionario con el carro objetivo
 */
function obtenerCarroObjetivo(objetivo, id){
    for (let i = 0; i < listCarros.length; i++) {
        if(listCarros[i].esObjetivo == true && objetivo == true){
            return listCarros[i];

        }
        else if(listCarros[i].esObjetivo == false && id == listCarros[i].id){
            return listCarros[i];
        }
    }
}

function actualizarPosiciones(carro, movimiento, matriz){ // mov que es de tipo [x,y]
    for(let i = 0; i < carro.posiciones.length; i++){
        carro.posiciones[i][0] += movimiento[0];
        carro.posiciones[i][1] += movimiento[1];
    }
}

/**
 * Esta funcion me hizo llorar 3 veces y perder pelo a la hora de calcular con los autos que bloquean
 * @param {Carro} nodo que es el carro 
 * @param {Coordenadas x,y} destino, posicion de la ubicacion del destinon
 * @returns El camino utilizando la distancia Manhattan (Solo toma 
 */
function calcularHeuristica(node, destino, posicion) {
    //                   x                 
    
   // if(node.esObjetivo == true){ // para el objetivo cada vez tratara de acercarse 
        let smoke = Math.abs(node.posiciones[posicion][0] - destino[0]) + Math.abs(node.posiciones[posicion][1] - destino[1]);
    
       return smoke;
 //   }
  //  else{
 //       if(node.orientacion == 'v'){ 
          // if(node.posiciones[][] - tablero[0][0]){
          // }
     //   }

    //}
}


function cambiarCarro(fila, columna){
    // busco cual es el carro con las filas, columnas
    for (let i = 0; i < listCarros.length; i++) {
        let carro = listCarros[i]; // Obtener el carro en el índice 'i'
        for (let j = 0; j < carro.posiciones.length; j++) {
            const pos = carro.posiciones[j]; // Obtener la posición en 'j'
            // Verificar si la fila y columna dadas están dentro de esta posición
            if (pos[0] === fila && pos[1] === columna) {
                nodoActual = carro;
                return carro;
            }
        }
    }

}

function calcularNuevoDestino(nodo, movimiento, destino){
    if(nodo.esObjetivo != true){ // si el carro no es el objetivo se cambia su destino
        if (movimiento[0] === -1 && movimiento[1] === 0) {
            destino = tablero[0][nodo.posiciones[0][1]];
            return destino;
        } else if (movimiento[0] === 1 && movimiento[1] === 0) {
            destino = tablero[tablero.length-1][nodo.posiciones[nodo.posiciones.length-1][1]];
            return destino;
        } else if (movimiento[0] === 0 && movimiento[1] === -1) {
            destino = tablero[nodo.posiciones[0][0]][0];
            return destino;
        } else if (movimiento[0] === 0 && movimiento[1] === 1) {
            destino = tablero[nodo.posiciones[nodo.posiciones.length-1][0]][tablero.length-1];
            return destino;
        }
    }
    else{
        destino = [4,6];
        return destino;
    }

}

function generarMovimientos(carroActual, matriz, destino, movimientos, sucesores){
    for(movimiento of movimientos){
        let fila;
        let columna;
        let posicion;
        if(movimiento[0] == -1 || movimiento[1] == -1){ // si se mueve a la izquierda se toma el carro de la pura izquierda o arriba
            fila = carroActual.posiciones[0][0] + movimiento[0];
            columna = carroActual.posiciones[0][1] + movimiento[1]
            posicion = 0;
        }else if(movimiento[0] == 1 || movimiento[1] == 1){ // si se mueve derecha
            fila = carroActual.posiciones[carroActual.posiciones.length - 1][0] + movimiento[0];
            columna = carroActual.posiciones[carroActual.posiciones.length - 1][1] + movimiento[1];
            posicion = carroActual.posiciones.length-1;
        }

        // Verificar si no se sale de la matriz
        if (fila >= 0 && columna >= 0 && fila < matriz.length && columna < matriz[0].length) {
            // verificar si en el movimiento se encuetra vacio o si se encuentra un carro bloqueado
            if(matriz[fila][columna] == "."){ // recordar que en las posiciones estan en forma x,y, si existe un carro bloqueandolo
                const nuevoCarro = JSON.parse(JSON.stringify(carroActual)); // para crear una copia completamente nueva
                nuevoCarro.costoInicial = carroActual.costoInicial + 1; // Costo de movimiento, los costos son de 1
                const nuevoDestino = calcularNuevoDestino(carroActual, movimiento, destino);
                nuevoCarro.heuristica = calcularHeuristica(nuevoCarro, nuevoDestino, posicion);
                nuevoCarro.costoTotal = nuevoCarro.costoInicial + nuevoCarro.heuristica
                actualizarPosiciones(nuevoCarro, movimiento, matriz);
                sucesores.push(nuevoCarro);
      
            }
            else if(matriz[fila][columna] == "|"){
                carroActual = cambiarCarro(fila, columna); // se cambia el carro
                const nuevoCarro = JSON.parse(JSON.stringify(carroActual)); // para crear una copia completamente nueva
                nuevoCarro.costoInicial = carroActual.costoInicial + 1; // Costo de movimiento, los costos son de 1
                nuevoCarro.costoTotal = nuevoCarro.costoInicial
                const nuevoDestino = calcularNuevoDestino(carroActual, movimiento, destino);
                nuevoCarro.heuristica = calcularHeuristica(nuevoCarro, nuevoDestino, posicion);
                nuevoCarro.costoTotal = nuevoCarro.costoInicial + nuevoCarro.heuristica
                sucesores.push(nuevoCarro);
            }
            else if(matriz[fila][columna] == "-"){
                carroActual = cambiarCarro(fila, columna); // se cambia el carro
                const nuevoCarro = JSON.parse(JSON.stringify(carroActual)); // para crear una copia completamente nueva
                nuevoCarro.costoInicial = carroActual.costoInicial + 1; // Costo de movimiento, los costos son de 1
                const nuevoDestino = calcularNuevoDestino(carroActual, movimiento, destino);
                nuevoCarro.heuristica = calcularHeuristica(nuevoCarro, nuevoDestino, posicion);
                nuevoCarro.costoTotal = nuevoCarro.costoInicial + nuevoCarro.heuristica
                sucesores.push(nuevoCarro);
            }
        }
    }
    return sucesores;

}

/**
 * Funcion que genera los siguients estados 
 * @param {Carro} carro en la posicion actual
 * @param {Tablero} matriz 
 * @param {Coordenadas x,y} destino 
 * @returns Array de todos los carros adyacentes
 */
function generarEstados(carroActual, matriz, destino) {
    const sucesores = []; // lista con todos los posibles estados
    const movimientoVertical = [[-1, 0], [1, 0],]; // Movimientos posibles: arriba, abajo
    const movimientoHorizontal = [[0, -1], [0, 1]]; // izquierda, derecha

    if (carroActual.orientacion == 'h'){
        return generarMovimientos(carroActual, matriz, destino, movimientoHorizontal, sucesores)
    }

    else if(carroActual.orientacion == 'v'){
        return generarMovimientos(carroActual, matriz, destino, movimientoVertical, sucesores)
    }

   // return sucesores;
}

/**
 * 
 * @param {*} nodoActual 
 * @param {*} destino posicion de la casilla de destino
 * @param {*} camino una lista que contiene las posiciones simbolizado el camino
 * @returns true si encontro la solucion, false sino
 */
function esSolucion(nodoActual, destino, camino){
    if (nodoActual.posiciones[nodoActual.posiciones.length-1][0] === destino[0] && nodoActual.posiciones[nodoActual.posiciones.length-1][1] === destino[1]) {
        let nodo = nodoActual;
        while (nodo) {
            camino.push([nodo.posiciones[3][0], nodo.posiciones[3][1]]);
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
 * @returns El camino a seguir
 */
function aEstrella(destino) {
    const abierto = []; // Nodos que estamos actualmente
    const cerrado = []; // Nodos que ya hemos visitado 
    const matriz = JSON.parse(JSON.stringify(tablero));
    
    const carroObjetivo = obtenerCarroObjetivo(true, 0); // en un inicio siempre se movera el carro rojo de primero
    carroObjetivo.calcularHeuristica = calcularHeuristica(carroObjetivo, destino, 3);
    carroObjetivo.costoInicial = 0;
    abierto.push(
        carroObjetivo
    );
    while (abierto.length > 0) {
        let carroActual = abierto[0]; // Es el estado del carro actual
        let indiceActual = 0;

        // Encontrar el carro con el costo minimo de abierto
        for (let i = 1; i < abierto.length; i++) {
            if (abierto[i].costoTotal < carroActual.costoTotal) {
                carroActual = abierto[i];
                indiceActual = i;
            }
        }

        // Mover el nodo actual del conjunto abierto al conjunto cerrado
        abierto.splice(indiceActual, 1); // Lo elimina de abierto
        cerrado.push(carroActual); // Lo pasa como cerrado

        // Verificar si hemos llegado al destino

        const camino = []
        if (esSolucion(carroActual, destino, camino)){
            return camino.reverse();
        }

        // Generar los siguientes movimientos
        const sucesores = generarEstados(carroActual, matriz, destino);

        for (const sucesor of sucesores) {
            // Verificar si el sucesor está en el conjunto cerrado
            if (cerrado.find(n => n.posiciones[n.posiciones.length-1][0] === sucesor.posiciones[sucesor.posiciones.length-1][0] && n.posiciones[n.posiciones.length-1][1] === sucesor.posiciones[sucesor.posiciones.length-1][1])) {
                continue;
            }

            // Verificar si el sucesor está en el conjunto abierto y tiene un valor f menor
            const nodoAbierto = abierto.find(n => n.posiciones[n.posiciones.length-1][0] === sucesor.posiciones[sucesor.posiciones.length-1][0] && n.posiciones[n.posiciones.length-1][1] === sucesor.posiciones[sucesor.posiciones.length-1][0]);
            if (nodoAbierto && sucesor.costoTotal >= nodoAbierto.costoTotal) {
                continue;
            }

            // Establecer el nodo actual como el padre del sucesor
            sucesor.padre = carroActual;

            // Agregar el sucesor al conjunto abierto si no está allí
           // if (!nodoAbierto) {
                abierto.push(sucesor);
            //}
        }
    }

    // Si no se puede encontrar un camino, devolver null
    return "WTF happend";
}


