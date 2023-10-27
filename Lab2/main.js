const slides = document.querySelector('.slides')
slides.classList.add('animation')

//interwal
let intervalRef = setInterval(next, 4000);

//wykonanie funkcji przy wczytywaniu strony
window.onload = randomImage;

//funkcje przyciskow
let liczba = 0;
let stop = 0;

function next(){
    if(liczba < 3000){
        liczba += 600;
        slides.style.transform = 'translateX(' + -liczba + 'px)';
    }
    else{
        liczba = 0;
        slides.style.transform = 'translateX(' + liczba + 'px)';
    }
}

function prev(){
    if(liczba <= 3000 && liczba > 0){
        liczba -= 600;
        slides.style.transform = 'translateX(' + -liczba + 'px)';
    }
    else{
        liczba = 3000;
        slides.style.transform = 'translateX(' + -liczba + 'px)';
    }
}

//funkcja do wybierania obrazu
function changeImage(a){
    liczba = a;
    slides.style.transform = 'translateX(' + -liczba + 'px)';
}

//losowanie poczatkowego obrazu
function randomImage(){
    var losuj = Math.floor(Math.random() * 6);
    var zakres = [0, 600, 1200, 1800, 2400, 3000];
    liczba = zakres[losuj];
    slides.style.transform = 'translateX(' + -liczba + 'px)';
}

//resetowanie zegara interwalu
function resetInterval(){
    if(stop == 0){
    clearInterval(intervalRef);
    intervalRef = setInterval(next, 4000)
    }
}

//funkcja do zatrzymywania slajdera
function stopStart(a){
    if(a == 1){
        stop = a;
        clearInterval(intervalRef);
    } else{
        stop = a;
        resetInterval();
        next();
    }
}