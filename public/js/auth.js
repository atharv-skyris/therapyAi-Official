const tabButtons = document.querySelectorAll(".tab-button");
const formContainers = document.querySelectorAll(".form-container");

tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const targetTab = this.getAttribute("data-tab");

    // Update active tab
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    // Show corresponding form
    formContainers.forEach((form) => {
      form.classList.remove("active");
      if (form.id === `${targetTab}-form`) {
        form.classList.add("active");
      }
    });
  });
});

document.querySelector("#signup-btn").addEventListener("click", async (e) => {
  let email = document.querySelector("#signup-email").value;
  let userName = document.querySelector("#signup-name").value;
  let password = document.querySelector("#signup-password").value;

  if ([email, password, userName].some((field) => field.length === 0)) {
    alert("All fields are required");
    return;
  }

  console.log({ email, userName, password });
  let response = await fetch("/auth/singup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      userName,
    }),
  });
  console.log("data send to the backend!!!");
  const data = await response.json();
  console.log(data);
  alert(data.message);
});

document.querySelector("#login-btn").addEventListener("click", async () => {
  let email = document.querySelector("#login-email").value;
  let password = document.querySelector("#login-password").value;

  if ([email, password].some((field) => field.length === 0)) {
    alert("All fields are required");
  }

  console.log(email, password);
  let response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  let data =  await response.json()
  console.log(data)
  alert(data.message)
});
