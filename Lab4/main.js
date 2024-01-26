document.addEventListener("DOMContentLoaded", function () { //Kod zostanie wykonany gdy struktura HTML będzie gotowa
const addNote = document.getElementById("addNote"); //Pobranie formularza do dodawania notatek
const container = document.getElementById("container"); //Pobranie kontenera, w którym będą wyświetlane notatki

addNote.addEventListener("submit", function (event) { //Nasłuchiwanie na zdarzenie submit formularza
  event.preventDefault(); //Zatrzymanie domyślnego zachowania przeglądarki (Nie przeładowuje strony)

  //Pobranie wartości z formularza
  const title = addNote.querySelector(".title").value;
  const content = addNote.querySelector(".content").value;
  const color = addNote.querySelector(".color").value;
  const pin = addNote.querySelector(".pin").checked;

  //Stworzenie obiektu notatki na podstawie pobranych wartości
  const note = {
    title: title,
    content: content,
    color: color,
    pin: pin,
    date: new Date().toLocaleString(),
  };

  saveToLocalStorage(note); //Zapisanie notatki w local storage
  displayNote(); //Wyświetlenie notatek
  addNote.reset(); //Zresetowanie formularza
});

//Funkcja do zapisu notatki w local storage
function saveToLocalStorage(note) {
  let notes = JSON.parse(localStorage.getItem("notes")) || []; //Pobranie notatek z local storage lub utworzenie nowej tablicy
  notes.push(note); //Dodanie nowej notatki do tablicy
  localStorage.setItem("notes", JSON.stringify(notes)); //Zapisanie tablicy z notatkami w local storage
}

//Funkcja do tworzenia elementu HTML dla notatki
function createNoteElement(note, index) {
  const noteBody = document.createElement("div"); //Tworzenie diva reprezentującego notatkę
  noteBody.classList.add("note"); //Dodanie klasy CSS dla notatki
  noteBody.style.backgroundColor = note.color; //Ustawienie koloru tła notatki na podstawie danych notatki

  const noteTitle = document.createElement("h3");
  noteTitle.classList.add("title");
  noteTitle.textContent = "Title: " + note.title; //Wstawienie tytułu notatki

  const noteContent = document.createElement("h4");
  noteContent.classList.add("content");
  noteContent.textContent = "Content: " + note.content; //Wstawienie treści notatki

  const noteDate = document.createElement("h5");
  noteDate.classList.add("data");
  noteDate.textContent = "Date: " + note.date; //Wstawienie daty notatki

  const noteActions = document.createElement("div"); //Tworzenie diva dla akcji notatki
  noteActions.classList.add("actions"); //Dodanie klasy CSS dla akcji

  //Tworzenie przycisku "Edit" do edycji notatki
  const editButton = createButton("Edit", "delete-btn", () => {
    editNote(index);
  });

  //Tworzenie przycisku "Delete" do usuwania notatki
  const deleteButton = createButton("Delete", "delete-btn", () => {
    deleteNote(index);
  });

  //Tworzenie przycisku "Pin" do przypinania/odpinania notatki
  const pinButton = createButton(
    note.pin ? "Unpin" : "Pin", "pin-btn", () => {
    togglePin(index);
  });

  //Dodanie wszystkich utworzonych elementów do diva reprezentującego notatkę
  noteBody.appendChild(noteTitle);
  noteBody.appendChild(noteContent);
  noteBody.appendChild(noteDate);
  noteBody.appendChild(noteActions);
  noteActions.appendChild(editButton);
  noteActions.appendChild(deleteButton);
  noteActions.appendChild(pinButton);

  return noteBody;
}

//Funkcja do tworzenia przycisków
function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.textContent = text;
  button.addEventListener("click", clickHandler);
  return button;
}

//Funkcja do wyświetlania notatek
function displayNote() {
  const notes = JSON.parse(localStorage.getItem("notes")) || []; //Pobranie notatek z local storage lub utworzenie pustej tablicy
  container.innerHTML = ""; //Wyczyszczenie kontenera przed wyświetleniem notatek

  //Podział notatek na przypięte i nieprzypięte
  const pinnedNote = notes.filter((note) => note.pin);
  const unpinnedNote = notes.filter((note) => !note.pin);

  //Wyświetlenie przypiętych i nieprzypiętych notatek
  pinnedNote.forEach(function (note, index) {
    const noteBody = createNoteElement(note, index); //Tworzenie elementu notatki
    container.appendChild(noteBody); //Dodanie elementu notatki do kontenera
  });

  unpinnedNote.forEach(function (note, index) {
    const noteBody = createNoteElement(note, index + pinnedNote.length); //Tworzenie elementu notatki
    container.appendChild(noteBody); //Dodanie elementu notatki do kontenera
  });
}
displayNote();

//Funkcja do usuwania notatki
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || []; //Pobranie notatek z local storage
  notes.splice(index, 1); //Usunięcie notatki z wybranym indeksem
  localStorage.setItem("notes", JSON.stringify(notes)); //Zapisanie zmienionej listy notatek w local storage
  displayNote(); //Ponowne wyświetlenie notatek
}

//Funkcja do przypinania/odpinania notatki
function togglePin(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || []; //Pobranie notatek z local storage
  notes[index].pin = !notes[index].pin; //Zmiana stanu przypięcia notatki
  notes.sort((a, b) => b.pin - a.pin); //Sortowanie notatek według stanu przypięcia
  localStorage.setItem("notes", JSON.stringify(notes)); //Zapisanie zmienionej listy notatek w local storage
  displayNote();
}

//Funkcja do edytowania notatki
function editNote(index) {
  let notes = JSON.parse(localStorage.getItem("notes")) || []; //Pobranie notatek z local storage
  const editedNote = notes[index]; //Wybranie edytowanej notatki

  //Pobranie nowego tytułu i treści notatki od użytkownika
  const editedTitle = prompt("Enter new title:", editedNote.title);
  const editedContent = prompt("Enter new content:", editedNote.content);
  const confirmColor = confirm("Do you want to change the color?");
    
  if (editedTitle !== null && editedContent !== null) { //Sprawdzenie, czy użytkownik podał nowy tytuł i treść
    if (confirmColor) { //Sprawdzenie, czy użytkownik chce zmienić kolor notatki
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = editedNote.color;
    
      const colorLabel = document.createElement("label");
      colorLabel.textContent = "Select new color:";
    
      const colorChange = document.createElement("div");
      colorChange.appendChild(colorLabel);
      colorChange.appendChild(colorInput);
    
      colorInput.addEventListener("change", function () {
        editedNote.color = colorInput.value;
        localStorage.setItem("notes", JSON.stringify(notes));
        displayNote();    
        colorChange.remove();
      });

      const noteBody = document.querySelector(`.note:nth-child(${1})`);
      noteBody.appendChild(colorChange);
    }
    
    //Zaktualizowanie tytułu i treści notatki
    editedNote.title = editedTitle;
    editedNote.content = editedContent;
    localStorage.setItem("notes", JSON.stringify(notes)); //Zapisanie zmienionej listy notatek w local storage
    displayNote(); //Ponowne wyświetlenie notatek po edycji
    }
  }
});