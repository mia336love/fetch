// export function post(data = {}) {
//   return (
//     fetch("http://localhost:3000/api/todos/api/todos"),
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     }
//       .then((response) => response.json())
//       .catch((error) => console.error("Error:", error))
//   );
// }

export function post(data = {}) {
  return fetch("http://localhost:3000/api/todos/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
}
