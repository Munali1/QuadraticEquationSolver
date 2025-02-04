const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
const solveButton = document.getElementById('solve');
const equationDisplay = document.getElementById('equation');
const solutionDisplay = document.getElementById('solution');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas background to white
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'black';
ctx.lineWidth = 4;
ctx.lineCap = 'round';

// Mouse Events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Touch Events for Mobile
canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});
canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({ offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top });
});
canvas.addEventListener('touchend', () => isDrawing = false);

// Draw Function
function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

// Clear Canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    equationDisplay.textContent = '';
    solutionDisplay.textContent = '';
});

// Solve Equation
solveButton.addEventListener('click', solveEquation);

function solveEquation() {
    const image = canvas.toDataURL();
    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            equationDisplay.textContent = 'Error';
            solutionDisplay.textContent = data.error;
        } else {
            equationDisplay.textContent = data.equation;
            solutionDisplay.textContent = data.solution;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        equationDisplay.textContent = 'Error';
        solutionDisplay.textContent = 'Failed to solve the equation.';
    });
}
