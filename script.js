const calculator = document.querySelector('.calculator');
const display = document.querySelector('.calculator-display');
const buttons = document.querySelector('.calculator-buttons');

let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    if (display.value === '' || display.value === 'Error') {
        display.value = '0';
    }
}

function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        display.value = digit;
        waitingForSecondOperand = false;
    } else {
        if (display.value === '0' || display.value === 'Error') {
             display.value = digit;
        } else {
             display.value += digit;
        }
    }
}

function inputDecimal(dot) {
    if (waitingForSecondOperand === true || display.value === 'Error') {
        display.value = '0.';
        waitingForSecondOperand = false;
        return;
    }

    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    if (display.value === 'Error') {
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);

        if (result === 'Error') {
            display.value = 'Error';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            return;
        }

        display.value = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => secondOperand === 0 ? 'Error' : firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '**': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    '%': (firstOperand, secondOperand) => firstOperand % secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    display.value = '0';
}

function deleteLastDigit() {
    if (waitingForSecondOperand || display.value === 'Error') {
        return;
    }

    let currentValue = display.value.toString();
    display.value = currentValue.slice(0, -1);

    if (display.value === '') {
        display.value = '0';
    }
}

buttons.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    const action = target.dataset.action;

    if (target.classList.contains('number')) {
        inputDigit(target.textContent);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.textContent);
        updateDisplay();
        return;
    }

    if (target.classList.contains('operator')) {
        if (action === 'clear') {
            resetCalculator();
        } else if (action === 'backspace') {
            deleteLastDigit();
        } else if (action === 'calculate') {
            if (firstOperand !== null && operator !== null && !waitingForSecondOperand) {
                const inputValue = parseFloat(display.value);
                const result = performCalculation[operator](firstOperand, inputValue);

                if (result === 'Error') {
                    display.value = 'Error';
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                    return;
                }

                display.value = String(result);
                firstOperand = result;
                operator = null;
                waitingForSecondOperand = true;
            }
        }
        else {
            let internalOperator = '';
            switch (action) {
                case 'add': internalOperator = '+'; break;
                case 'subtract': internalOperator = '-'; break;
                case 'multiply': internalOperator = '*'; break;
                case 'divide': internalOperator = '/'; break;
                case 'exponential': internalOperator = '**'; break;
                case 'modulus': internalOperator = '%'; break;
                default: break;
            }
            if (internalOperator) {
                handleOperator(internalOperator);
            }
        }
        if (action !== 'backspace' && action !== 'calculate') {
            updateDisplay();
        }
        return;
    }
});

updateDisplay();
