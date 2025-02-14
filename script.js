const resources = [
    { name: "Антиматерия", image: "images/1.png", index: "01" },
    { name: "Титан", image: "images/2.png", index: "02" },
    { name: "Кремний", image: "images/3.png", index: "03" },
    { name: "Энергия", image: "images/4.png", index: "04" },
    { name: "Наниты", image: "images/5.png", index: "05" },
    { name: "Воронка искривления времени", image: "images/6.png", index: "06" },
    { name: "Древний монолит угасшей империи", image: "images/7.png", index: "07" },
    { name: "Остатки рабочих дронов древних цивилизаций", image: "images/8.png", index: "08" },
    { name: "Знания по инженерии", image: "images/9.png", index: "09" },
    { name: "Знания по нанотехнологиям", image: "images/10.png", index: "10" },
    { name: "Знания по физике", image: "images/11.png", index: "11" },
    { name: "Знания по энергетике", image: "images/12.png", index: "12" },
];

let selectedCell = null;
let currentLevel = "0";
let selectedImage = null;
let selectedResourceIndex = "00"; // Индекс выбранного ресурса
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
        <button onclick="selectResource('${resource.image}', '${resource.index}')">
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
function selectResource(image, resourceIndex) {
    selectedImage = image;
    selectedResourceIndex = resourceIndex; // Сохраняем индекс ресурса
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
        <img src="${selectedImage}" alt="Ресурс" width="50" height="50" data-resource-index="${selectedResourceIndex}">
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
    const data = [];

    // Собираем данные о каждой клетке
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const resourceIndex = getResourceIndex(cell); // Индекс ресурса
        const level = getCellLevel(cell); // Уровень
        const isClosed = cell.classList.contains("closed") ? 0 : 1; // Состояние клетки (0 - закрыта, 1 - открыта)

        // Если клетка имеет ресурс, уровень или открыта, добавляем её в данные
        if (resourceIndex !== "00" || level !== "000" || isClosed === 1) {
            const cellNumber = index + 1; // Номер клетки (от 1 до 36)
            const resourceCode = resourceIndex; // Код ресурса (уже в формате 01-12)
            const levelCode = level.padStart(3, "0"); // Код уровня
            const stateCode = isClosed; // Состояние клетки

            // Формируем строку для клетки
            const cellData = `${cellNumber}:${resourceCode}:${levelCode}:${stateCode}`;
            data.push(cellData);
        }
    });

    // Преобразуем данные в строку и выводим в текстовое поле
    const exportDataString = data.join("\n");
    document.getElementById("exportImportText").value = exportDataString;
}

// Функция для получения индекса ресурса из клетки
function getResourceIndex(cell) {
    const img = cell.querySelector("img");
    if (!img) return "00"; // Если ресурса нет, возвращаем "00"
    return img.getAttribute("data-resource-index") || "00"; // Возвращаем индекс ресурса или "00", если атрибут отсутствует
}

// Функция для получения уровня из клетки
function getCellLevel(cell) {
    const levelElement = cell.querySelector(".level");
    return levelElement ? levelElement.textContent.padStart(3, "0") : "000";
}

// Функция для импорта данных
function importData() {
    const textArea = document.getElementById("exportImportText");
    const importDataString = textArea.value;

    try {
        // Очищаем все клетки перед импортом
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.innerHTML = `
                Пусто
                <div class="cell-number">${cell.querySelector('.cell-number').textContent}</div>
            `;
            cell.classList.add("closed"); // По умолчанию все клетки закрыты
        });

        // Разбиваем данные на строки
        const lines = importDataString.split("\n");

        lines.forEach(line => {
            const [cellNumber, resourceCode, levelCode, stateCode] = line.split(":");

            const cellIndex = parseInt(cellNumber) - 1; // Индекс клетки (от 0 до 35)
            const resource = resources.find(res => res.index === resourceCode); // Находим ресурс по индексу
            const level = parseInt(levelCode); // Уровень
            const isClosed = parseInt(stateCode) === 0; // Состояние клетки (0 - закрыта, 1 - открыта)

            const cell = cells[cellIndex];
            if (resource) {
                cell.innerHTML = `
                    <img src="${resource.image}" alt="${resource.name}" width="50" height="50" data-resource-index="${resource.index}">
                    <div class="level">${level}</div>
                    <div class="cell-number">${cell.querySelector('.cell-number').textContent}</div>
                `;
            }

            if (isClosed) {
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
