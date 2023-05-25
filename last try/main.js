(function () {
  const container = document.getElementById("todo-app");
  const todoAppTitle = createAppTitle("Список дел");
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // Получение списка дел с сервера
  function loadTodoList() {
    let url = "http://localhost:3000/api/todos";
    const owner = new URLSearchParams(window.location.search).get("owner");
    if (owner) {
      url += `?owner=${owner}`;
    }
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

  todoItemForm.form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    const newTodo = {
      name: todoItemForm.input.value,
      owner: "user",
    };

    // Отправка POST-запроса на сервер для создания нового дела
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

  function createAppTitle(title) {
    const appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const buttonWrapper = document.createElement("div");
    const button = document.createElement("button");

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

  function createTodoList() {
    const list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name) {
    const item = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

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

    return {
      item,
      doneButton,
      deleteButton,
    };
  }
})();
