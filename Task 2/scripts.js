document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = Array.from(document.getElementsByClassName('btn'));

    let currentInput = '';
    let operator = '';
    let value1 = '';
    let value2 = '';

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const value = e.target.dataset.value;

            if (value === 'C') {
                // Clear display and reset variables
                currentInput = '';
                operator = '';
                value1 = '';
                value2 = '';
                display.innerText = '0';
            } else if (value === '=') {
                // Calculate and display result
                value2 = currentInput;
                if (operator && value1 && value2) {
                    const result = operate(Number(value1), Number(value2), operator);
                    display.innerText = result;
                    value1 = result; // Store result for chained operations
                    currentInput = '';
                    operator = '';
                }
            } else if (['+', '-', '*', '/'].includes(value)) {
                // Set operator and store current input
                if (currentInput !== '') {
                    value1 = currentInput;
                    operator = value;
                    currentInput = '';
                }
            } else {
                // Append number to current input
                currentInput += value;
                display.innerText = currentInput;
            }
        });
    });

    function operate(value1, value2, operator) {
        switch (operator) {
            case '+':
                return (value1 + value2).toString();
            case '-':
                return (value1 - value2).toString();
            case '*':
                return (value1 * value2).toString();
            case '/':
                return value2 !== 0 ? (value1 / value2).toString() : 'Error';
            default:
                return '';
        }
    }
});
