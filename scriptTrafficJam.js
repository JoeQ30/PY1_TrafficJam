let contador = 0;
let titulo = document.getElementById("elementoh1");
/**
 * Funcion que convierte el input del tablero en una matriz
 * @param {*} tablero 
 */
function representarTableroMatriz(tablero){
    let matriz = [];
    let auxiliar = []
    let columna = 0;
    let contador = 1; // variable que cuenta la cantidad de - o de | en el tablero
    for(fila = 0; fila < tablero.length; fila++){
        if(tablero[fila] == "."){
            auxiliar.push(0);
        }
        else if(tablero[fila] == "\n"){
            matriz.push([auxiliar]);
            auxiliar = [];

        }
        else if(tablero[fila] == "-"){
            auxiliar.push(contador);
        }
        else if(tablero[fila] == ">"){
            auxiliar.push(contador);
            matriz.push([auxiliar]);
            contador++;
            auxiliar = [];
        }
        else if(tablero[fila] == "|"){
            auxiliar.push(contador);
        }
        else if(tablero[fila] == "v"){
            auxiliar.push(contador);
            matriz.push([auxiliar]);
            contador++;
            auxiliar = [];
        }

    }
    matriz.push([auxiliar]);
    console.log(matriz);
    titulo.textContent = matriz;
    console.log(matriz[1]);
}
/**
 * Clase para  el carro que sirve tambien como nodo
 */
class Carro {
    constructor(x, y, g, h) {
        this.x = x; //Posicion x
        this.y = y; // Posicion Y
        this.g = g; // Costo desde el nodo inicial hasta este nodo
        this.h = h; // Heurística: estimación del costo desde este nodo hasta el nodo objetivo
        this.f = g + h; // Costo total: g + h
        this.padre = null; // Nodo padre en el camino óptimo
    }
}

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

// Ejemplo de uso
const matriz = [
    [0, 0, 0, 1],
    ["B", 0, "B", 0],
    [0, 0, "X", 0]
];

const inicio = [0, 3];
const destino = [2, 2];

const camino = aEstrella(matriz, inicio, destino);

if (camino === null) {
    console.log("No se puede encontrar un camino válido.");
} else {
    console.log("Camino encontrado:");
    for (const nodo of camino) {
        console.log(`(${nodo[0]}, ${nodo[1]})`);
    }
}


// representarTableroMatriz("- - - > . \n . - - > . . .");
