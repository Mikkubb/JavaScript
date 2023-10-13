const liczba1 = document.querySelector('#liczba1');
const liczba2 = document.querySelector('#liczba2');
const liczba3 = document.querySelector('#liczba3');
const liczba4 = document.querySelector('#liczba4');



//const btnPrzelicz = document.querySelector('#przelicz');
//btnPrzelicz.addEventListener('click', () => {})

addEventListener('input', () => {
    const l1 = parseFloat(liczba1.value);
    const l2 = parseFloat(liczba2.value);
    const l3 = parseFloat(liczba3.value);
    const l4 = parseFloat(liczba4.value);
    

    if(isNaN(l1) || isNaN(l2) || isNaN(l3) || isNaN(l4)) document.querySelector('#wynik').innerHTML = 'Uzupełnij pola liczbami';
    else{
        const suma = "Suma: " + (l1 + l2 + l3 + l4);
        const srednia = "Srednia: " + (l1 + l2 + l3 + l4) / 4;
        const min = "Minimalna: " + Math.min(l1, l2, l3, l4);
        const max = "Maksymalna: " + Math.max(l1, l2, l3, l4);
        document.querySelector('#wynik').innerHTML = `Wynik: </br> ${suma} </br> ${srednia} </br> ${min} </br> ${max}`;
    }
})