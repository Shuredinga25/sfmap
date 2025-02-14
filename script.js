const resources = [
    { name: "Антиматерия", image: "images/1.png" },
    { name: "Титан", image: "images/2.png" },
    { name: "Кремний", image: "images/3.png" },
    { name: "Энергия", image: "images/4.png" },
    { name: "Наниты", image: "images/5.png" },
    { name: "Воронка искривления времени", image: "images/6.png" },
    { name: "Древний монолит угасшей империи", image: "images/7.png" },
    { name: "Остатки рабочих дронов древних цивилизаций", image: "images/8.png" },
    { name: "Знания по инженерии", image: "images/9.png" },
    { name: "Знания по нанотехнологиям", image: "images/10.png" },
    { name: "Знания по физике", image: "images/11.png" },	
    { name: "Знания по энергетике", image: "images/12.png" },	
    // Добавь остальные ресурсы с путями к картинкам
];

let selectedCell = null;
let currentLevel = "0";
let selectedImage = null;
let isEditMode = false; // Режим редактирования (открыть/закрыть)

// Создаем сетку 6x6
const grid = document.getElementById("grid");
for (let i = 0; i < 36; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = "Пусто";
    cell.addEventListener("click", () => handleCellClick(i));

    // Вычисляем номер клетки
    const row = 5 - Math.floor(i / 6); // Обратный порядок строк (снизу вверх)
    const col = i % 6; // Столбцы идут слева направо
    const cellNumber = row * 6 + col + 1; // Нумерация с 1 до 36

    // Добавляем порядковый номер клетки
    const cellNumberElement = document.createElement("div");
    cellNumberElement.classList.add("cell-number");
    cellNumberElement.textContent = cellNumber;
    cell.appendChild(cellNumberElement);

    grid.appendChild(cell);
}

// Обработка клика по клетке
function handleCellClick(cellIndex) {
    if (isEditMode) {
        // Режим "открыть/закрыть"
        const cell = grid.children[cellIndex];
        cell.classList.toggle("closed");
    } else {
        // Обычный режим
        openResourceDialog(cellIndex);
    }
}

// Переключение режима
function toggleMode() {
    const toggleButton = document.getElementById("toggleModeButton");
    isEditMode = !isEditMode;
    toggleButton.classList.toggle("active", isEditMode);
    toggleButton.textContent = isEditMode ? "Режим: Открыть/Закрыть" : "Режим: Обычный";
}

// Открываем диалог изменения названия
function openTitleEditor() {
    document.getElementById("titleEditorDialog").style.display = "flex";
}

// Закрываем диалог изменения названия
function closeTitleEditor() {
    document.getElementById("titleEditorDialog").style.display = "none";
}

// Изменяем название
function changeTitle() {
    const titleInput = document.getElementById("titleInput");
    const newTitle = titleInput.value.trim();
    if (newTitle) {
        document.getElementById("title").textContent = newTitle;
    }
    closeTitleEditor();
}

// Очищаем клетку
function clearCell() {
    const cell = grid.children[selectedCell];
    cell.innerHTML = `
        Пусто
        <div class="cell-number">${cell.querySelector('.cell-number').textContent}</div>
    `;
    closeResourceDialog();
}

// Открываем диалог выбора ресурса
function openResourceDialog(cellIndex) {
    selectedCell = cellIndex;
    const resourceList = document.getElementById("resourceList");
    resourceList.innerHTML = resources.map(resource => `
        <button onclick="selectResource('${resource.image}')">
            <img src="${resource.image}" alt="${resource.name}" width="50" height="50">
        </button>
    `).join("");
    document.getElementById("resourceDialog").style.display = "flex";
}

// Закрываем диалог выбора ресурса
function closeResourceDialog() {
    document.getElementById("resourceDialog").style.display = "none";
}

// Выбираем ресурс и открываем диалог выбора уровня
function selectResource(image) {
    selectedImage = image;
    closeResourceDialog();
    currentLevel = "0";
    updateLevelDisplay();
    document.getElementById("levelDialog").style.display = "flex";
}

// Закрываем диалог выбора уровня
function closeLevelDialog() {
    document.getElementById("levelDialog").style.display = "none";
}

// Добавляем цифру к уровню
function addDigit(digit) {
    if (currentLevel.length < 3) {
        currentLevel = currentLevel === "0" ? digit.toString() : currentLevel + digit;
        updateLevelDisplay();
    }
}

// Удаляем последнюю цифру
function deleteDigit() {
    if (currentLevel.length > 1) {
        currentLevel = currentLevel.slice(0, -1);
    } else {
        currentLevel = "0";
    }
    updateLevelDisplay();
}

// Обновляем отображение уровня
function updateLevelDisplay() {
    document.getElementById("levelDisplay").textContent = currentLevel;
}

// Подтверждаем уровень и обновляем клетку
function confirmLevel() {
    closeLevelDialog();
    const cell = grid.children[selectedCell];
    cell.innerHTML = `
        <img src="${selectedImage}" alt="Ресурс" width="50" height="50">
        <div class="level">${currentLevel}</div>
        <div class="cell-number">${cell.querySelector('.cell-number').textContent}</div>
    `;
}

// Функция для копирования текста в буфер обмена
function copyText() {
    const textArea = document.getElementById("exportImportText");
    textArea.select();
    document.execCommand("copy");
}

// Функция для очистки текстового поля
function clearText() {
    const textArea = document.getElementById("exportImportText");
    textArea.value = "";
}

// Функция для экспорта данных
function exportData() {
    const data = {
        title: document.getElementById("title").textContent,
        cells: []
    };

    // Собираем данные о каждой клетке
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const cellData = {
            index: index,
            content: cell.innerHTML,
            isClosed: cell.classList.contains("closed")
        };
        data.cells.push(cellData);
    });

    // Преобразуем данные в JSON и выводим в текстовое поле
    const jsonData = JSON.stringify(data);
    document.getElementById("exportImportText").value = jsonData;
}

// Функция для импорта данных
function importData() {
    const textArea = document.getElementById("exportImportText");
    const jsonData = textArea.value;

    try {
        const data = JSON.parse(jsonData);

        // Восстанавливаем название карты
        document.getElementById("title").textContent = data.title;

        // Восстанавливаем клетки
        data.cells.forEach(cellData => {
            const cell = document.querySelectorAll(".cell")[cellData.index];
            cell.innerHTML = cellData.content;
            if (cellData.isClosed) {
                cell.classList.add("closed");
            } else {
                cell.classList.remove("closed");
            }
        });

        alert("Данные успешно импортированы!");
    } catch (error) {
        alert("Ошибка при импорте данных. Проверьте корректность кода.");
    }
}
