const socket = io();


let circlesize = 20;
let identificador = 0;

let elementos = [];
let cursores = [];
let selectedColor = { r: 0, g: 0, b: 0 };

function setup() {
  createCanvas(400, 400);
  identificador = int(random() * 1000);
  console.log("identificador: ", identificador);


  const colorPicker = document.getElementById("colorPicker");
  const changeColorButton = document.getElementById("changeColor");


  colorPicker.addEventListener("change", (event) => {
    const colorHex = event.target.value;
    const colorRGB = hexToRgb(colorHex);
    selectedColor = colorRGB;

  const sizeInput = document.getElementById("circlesize");
  sizeInput.addEventListener("input", (event) => {
    circlesize = parseInt(event.target.value);
});
  });

  changeColorButton.addEventListener("click", () => {

    socket.emit("cambiar-color", selectedColor);
  });
}

function draw() {
  background(200);

  elementos.forEach((elemento) => {
    fill(elemento.r, elemento.g, elemento.b);
    ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
  });

  cursores.forEach((elemento) => {
    fill(0, 0, 0);
    ellipse(elemento.x, elemento.y, elemento.size, elemento.size);
  });
}

function mousePressed() {
  const elemento = {
    x: mouseX,
    y: mouseY,
    r: selectedColor.r,
    g: selectedColor.g,
    b: selectedColor.b,
    size: circlesize,
  };
  socket.emit("enviar-elemento", elemento);
}

function mouseDragged() {
  const elemento = {
    x: mouseX,
    y: mouseY,
    r: selectedColor.r,
    g: selectedColor.g,
    b: selectedColor.b,
    size: circlesize,
    id: identificador,
  };
  socket.emit("enviar-cursor", elemento);
}

socket.on("elemento-recibido", (elemento) => {
  console.log("recibiendo-elemento: ", elemento);
  elementos.push(elemento);
});

socket.on("cursor-recibido", (elemento) => {
  console.log("recibiendo-cursor: ", elemento);

  let cursorIndex = cursores.findIndex((item) => elemento.id == item.id);
  if (cursorIndex != -1) {
    cursores[cursorIndex] = elemento;
  } else {
    cursores.push(elemento);
  }
});

// Función para convertir un color hexadecimal en RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

socket.on("cambiar-color", (color) => {
  selectedColor = color;
});
