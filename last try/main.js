(function () {
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  let container = document.getElementById("todo-app");
  let todoAppTitle = createAppTitle("Список дел");
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // получение списка дел с сервера
  function loadTodoList() {
    let url = "http://localhost:3000/api/todos";
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Ошибка загрузки списка дел");
        }
      })
      .then((data) => {
        todoList.innerHTML = "";
        data.forEach((todo) => {
          const todoItem = createTodoItem(todo.name);

          // Установка статуса выполнения дела в зависимости от полученных данных
          if (todo.done) {
            todoItem.item.classList.add("list-group-item-success");
          }

          // Добавление обработчиков событий для кнопок
          todoItem.doneButton.addEventListener("click", () => {
            // Отправка PATCH-запроса на сервер для изменения статуса выполнения дела
            const url = `http://localhost:3000/api/todos/${todo.id}`;
            const updateData = { done: !todo.done };
            fetch(url, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Ошибка изменения статуса выполнения дела");
                }
              })
              .catch((error) => {
                console.error(error);
                alert("Ошибка изменения статуса выполнения дела");
              });

            todoItem.item.classList.toggle("list-group-item-success");
          });

          todoItem.deleteButton.addEventListener("click", () => {
            if (confirm("Вы уверены?")) {
              // Отправка DELETE-запроса на сервер для удаления дела
              const url = `http://localhost:3000/api/todos/${todo.id}`;
              fetch(url, { method: "DELETE" })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Ошибка удаления дела");
                  }
                  todoItem.item.remove();
                })
                .catch((error) => {
                  console.error(error);
                  alert("Ошибка удаления дела");
                });
            }
          });

          todoList.append(todoItem.item);
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Ошибка загрузки списка дел");
      });
  }

  loadTodoList();

  //браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
  todoItemForm.form.addEventListener("submit", function (e) {
    //эта строчка необходима, чтобы предотвратить стандартное действие браузера
    //в этом случае мы не хотим, чтобы страница перезагружалась при отправке формы
    e.preventDefault();

    //игнорируем создание элемента, если пользователь ничего не ввёл в поле
    if (!todoItemForm.input.value) {
      return;
    }

    // отправить новое дело на сервер
    const newTodo = {
      name: todoItemForm.input.value,
      owner: "todo",
    };

    // создание нового дела (POST)
    fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Ошибка создания нового дела");
        }
      })
      .then((todo) => {
        const todoItem = createTodoItem(todo.name);

        // изменение статуса дела (PATCH)
        todoItem.doneButton.addEventListener("click", () => {
          const url = `http://localhost:3000/api/todos/${todo.id}`;
          const updateData = { done: !todo.done };
          fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          })
            .then((response) => {
              // проверить на ошибки (response.ok ?)
              if (!response.ok) {
                throw new Error("Ошибка изменения статуса выполнения дела");
              }
            })
            .catch((error) => {
              console.error(error);
              alert("Ошибка изменения статуса выполнения дела");
            });

          todoItem.item.classList.toggle("list-group-item-success");
        });

        // удаление дела (DELETE)
        todoItem.deleteButton.addEventListener("click", () => {
          if (confirm("Вы уверены?")) {
            const url = `http://localhost:3000/api/todos/${todo.id}`;
            fetch(url, { method: "DELETE" })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Ошибка удаления дела");
                }
                todoItem.item.remove();
              })
              .catch((error) => {
                console.error(error);
                alert("Ошибка удаления дела");
              });
          }
        });

        todoList.append(todoItem.item);
        todoItemForm.input.value = "";
      })
      .catch((error) => {
        console.error(error);
        alert("Ошибка создания нового дела");
      });
  });

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите новое дело";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }
  // создаём и возвращаем элемент для списка дел
  function createTodoItem(name) {
    let item = document.createElement("li");
    //кнопки перемещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам,
    // чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }
})();
