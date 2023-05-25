import { post } from "./post.js";

let inp = document.querySelector(".inp");
let btn = document.querySelector(".btn");
let taskList = document.createElement("ul");

document.body.append(taskList);

let array = [
  {
    name: "do homework",
    done: false,
  },
  {
    name: "buy milk",
    done: false,
  },
];

// размещение LS на странице (обновление стр)
array.forEach(function (task) {
  // console.log(task);
  let display = `
    <li id="${task.id}" class="taskList">
       <span class="spanTitle">${task.name}</span>
            <div class="taskButtons">
              <button class="doneBtn" data-action="done">&#10004</button>
              <button class="deleteBtn" data-action="delete">&#10008</button>
            </div>
      </li>
  `;
  taskList.insertAdjacentHTML("beforeend", display);
});

function addTask() {
  if (inp.value !== "") {
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
          name: data.name,
          owner: data.owner,
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

        inp.value = "";
        inp.focus();
      })
      // .then((data) => {
      //   let obj = {
      //     id: data.id,
      //     name: data.name,
      //     done: data.done,
      //   };

      //   array.push(obj);
      //   console.log(array);

      //   let display = `
      //       <li id="${obj.id}" class="taskList">
      //           <span class="spanTitle">${obj.name}</span>
      //               <div class="taskButtons">
      //                   <button class="doneBtn" data-action="done">&#10004</button>
      //                   <button class="deleteBtn" data-action="delete">&#10008</button>
      //               </div>
      //       </li>
      //   `;
      //   taskList.insertAdjacentHTML("beforeend", display);
      // })
      .catch((error) => console.log(error));
  } else {
    alert("Введите задачу");
  }
}

// function addTask() {
//   if (inp.value !== "") {
//     let obj = {
//       name: inp.value,
//       owner: "todo",
//       done: false,
//     };
//     post(obj)
//       .then((data) => {
//         console.log(data);
//         array.push(data);
//         let display = `
//           <li id="${data.id}" class="taskList">
//             <span class="spanTitle">${data.name}</span>
//             <div class="taskButtons">
//               <button class="doneBtn" data-action="done">&#10004</button>
//               <button class="deleteBtn" data-action="delete">&#10008</button>
//             </div>
//           </li>
//         `;
//         taskList.insertAdjacentHTML("beforeend", display);
//         inp.value = "";
//         inp.focus();
//       })
//       .catch((error) => console.error(error));
//   } else {
//     alert("Введите задачу");
//   }
// }
btn.addEventListener("click", addTask);

// enter
inp.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    addTask();
  }
});

function doneTask(event) {
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest("li");
    const taskTitle = parentNode.querySelector("span");
    taskTitle.classList.toggle("done");

    const id = parentNode.id;
    const task = array.find((task) => {
      if (task.id == id) {
        return true;
      }
    });
    task.done = !task.done;
  }
}

taskList.addEventListener("click", doneTask);

// delete button
// use findIndex
function deleteTask(event) {
  if (event.target.dataset.action === "delete") {
    let check = confirm("Вы уверены, что хотите удалить задачу?");
    if (check == true) {
      const parentNode = event.target.closest("li");
      parentNode.remove();

      const id = parentNode.id;
      const index = array.findIndex((task) => {
        if (task.id == id) {
          return true;
        }
      });
      // console.log(index);

      array.splice(index, 1);
    }
  }
}
taskList.addEventListener("click", deleteTask);
