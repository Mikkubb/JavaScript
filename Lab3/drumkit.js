//Rejestrowanie zdarzenia "keypress" i wywołanie funkcji onKeyPress
document.addEventListener('keypress', onKeyPress)

//Tablica, która przechowuje nagrane dźwięki
const recorded = []
//Zmienna określająca aktualny kanał nagrywania
let recordedChannel = null


//Mapowanie klawiszy klawiatury na konkretne elementy dźwiękowe
const KeyToSound = {
    'a': document.querySelector('#s1'),
    's': document.querySelector('#s2'),
    'd': document.querySelector('#s3'),
    'f': document.querySelector('#s4'),
    'g': document.querySelector('#s5'),
    'h': document.querySelector('#s6'),
    'j': document.querySelector('#s7'),
    'k': document.querySelector('#s8'),
    'l': document.querySelector('#s9')
}

//Obsługa zdarzenia naciśnięcia klawisza
function onKeyPress(event) {
    const sound = KeyToSound[event.key] //Znajduje dźwięk odpowiadający naciśniętemu klawiszowi i odtwarza go
    document.querySelector(`#${event.key}`).classList.add('characterPress')  //Dodaje efekt wizualny naciśnięcia klawisza
    setTimeout(() => {document.querySelector(`#${event.key}`).classList.remove('characterPress')}, 200) //Usuniecie efektu wizualnego po krótkim czasie
    playSound(sound)

    //Jeśli nagrywanie jest aktywne dla określonego kanału, dodaje dźwięk do nagrania
    if (recordedChannel !== null) {
        recorded[recordedChannel].push({ time: Date.now(), sound })
    }
}
//Odtwarzanie dźwięku
function playSound(sound) {
    sound.currentTime = 0
    sound.play()
}

//Start nagrywania na konkretnym kanale
function startRecording(channel) {
    recordedChannel = channel
    recorded[channel] = []
}

//Zatrzymywanie nagrywania na biezacym kanale
function stopRecording() {
    recordedChannel = null
}

//Odtwarzanie pojedynczego kanalu
function playChannel(channel) {
    recorded[channel].forEach(({ time, sound }) => {
        setTimeout(() => playSound(sound), time - recorded[channel][0].time)
    })
}

//Odtwarzanie wszystkich kanalow
//Każdy dźwięk jest odtwarzany z opóźnieniem obliczanym jako różnica czasu między aktualnym nagraniem a pierwszym nagraniem na kanale
function playAllChannel(){
    //console.log(recorded[1])
    recorded[1].forEach(({ time, sound }) => {
        setTimeout(() => playSound(sound), time - recorded[1][0].time)
    })
    recorded[2].forEach(({ time, sound }) => {
        setTimeout(() => playSound(sound), time - recorded[2][0].time)
    })
    recorded[3].forEach(({ time, sound }) => {
        setTimeout(() => playSound(sound), time - recorded[3][0].time)
    })
    recorded[4].forEach(({ time, sound }) => {
        setTimeout(() => playSound(sound), time - recorded[4][0].time)
    })
}