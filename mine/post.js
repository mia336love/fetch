export function post(inp, array, taskList) {
  fetch("http://localhost:3000/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: inp.value,
      owner: "todo",
      done: false,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let obj = {
        id: data.id,
        name: data.name,
        done: data.done,
      };

      array.push(obj);
      console.log(array);

      let display = `
            <li id="${obj.id}" class="taskList">
                <span class="spanTitle">${obj.name}</span>
                    <div class="taskButtons">
                        <button class="doneBtn" data-action="done">&#10004</button>
                        <button class="deleteBtn" data-action="delete">&#10008</button>
                    </div>
            </li>
        `;
      taskList.insertAdjacentHTML("beforeend", display);
    })
    .catch((error) => alert(error));
}
