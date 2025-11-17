const display = document.getElementById('display');
const historyList = document.getElementById('historyList');
let memory = 0;
let historyArr = [];
let degMode = true; // Degrees mode

// Append character
function appendValue(val) {
    display.value += val;
}

// Clear display
function clearDisplay() {
    display.value = '';
}

// Backspace
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Factorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for(let i=1;i<=n;i++) res *= i;
    return res;
}

// Calculate
function calculateResult() {
    try {
        let expr = display.value
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-')
            .replace(/\^/g, '**')
            .replace(/pi/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/!/, 'factorial($&)');

        // Handle sin, cos, tan with degrees/radians
        expr = expr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (match,p1,p2) => {
            let val = eval(p2);
            if(degMode) val = val * Math.PI / 180;
            return `Math.${p1}(${val})`;
        });

        let result = eval(expr);
        if(!isFinite(result)) result = 'Math Error';
        addHistory(display.value + ' = ' + result);
        display.value = result;
    } catch (err) {
        display.value = 'Error';
    }
}

// Add history
function addHistory(entry) {
    historyArr.unshift(entry);
    if(historyArr.length>10) historyArr.pop();
    historyList.innerHTML = '';
    historyArr.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Memory functions
function memoryPlus() { memory += parseFloat(display.value)||0; display.value=''; }
function memoryMinus() { memory -= parseFloat(display.value)||0; display.value=''; }
function memoryRecall() { display.value += memory; }
function memoryClear() { memory=0; }

// Theme toggle
document.getElementById('themeBtn').addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
});

// Degrees toggle
document.getElementById('degToggle').addEventListener('change', (e)=>{
    degMode = e.target.checked;
});

// Keyboard support
document.addEventListener('keydown', (e)=>{
    if ((e.key>='0'&&e.key<='9') || '+-*/().%^'.includes(e.key)) appendValue(e.key);
    else if(e.key==='Enter') calculateResult();
    else if(e.key==='Backspace') backspace();
    else if(e.key==='Escape') clearDisplay();
});
