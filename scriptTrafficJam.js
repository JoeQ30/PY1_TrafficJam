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
    for(fila = 0; fila < tablero.length; fila++){
        if(tablero[fila] == "."){
            auxiliar.push(0);
        }
        else if(tablero[fila] == "\n"){
            matriz.push([auxiliar]);
            auxiliar = [];

        }

    }
    matriz.push([auxiliar]);
    console.log(matriz);
    titulo.textContent = matriz;
    console.log(matriz[0][0]);
}

console.log(representarTableroMatriz(".....\n...."))
