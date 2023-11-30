import {
  createContactForm,
  drawer,
  rows,
  updateContactForm,
} from "../core/selectors";
import { baseUrl } from "../core/variables";

// disabled form when loading
const formDisabled = (status) => {
  createContactForm.querySelector("[name='name']").disabled = status;
  createContactForm.querySelector("[name='number']").disabled = status;
  createContactForm.querySelector("button").disabled = status;
  createContactForm.querySelector("button").innerText = status
    ? "Loading..."
    : "Add Contact";
};

export const contactCreateFormHandler = async (event) => {
  event.preventDefault();

  const formData = new FormData(createContactForm);

  formDisabled(true); // disabled // reduced opacity

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const reqBody = JSON.stringify({
    name: formData.get("name"),
    phNumber: formData.get("number"),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: reqBody,
  };

  // insert contacts POST method into json-server
  const response = await fetch(`${baseUrl}/contacts`, requestOptions);
  const data = await response.json();
  console.log(data);

  // fetch contacts GET method
  // fetchContact("/contacts");

  // insert new contact UI ---> using json-server response data
  rows.append(createContactRow(data));

  formDisabled(false);

  createContactForm.reset();
};

// fetch and render contacts

export const createContactRow = ({ id, name, phNumber }) => {
  const row = document.createElement("tr");
  row.className =
    "bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600";
  row.setAttribute("contact-id", id);
  row.innerHTML = `
    <td class="px-6 py-4">${id}</td>
    <td class="px-6 py-4 font-semibold name-cell">${name}</td>
    <td class="px-6 py-4 font-semibold phone-cell">${phNumber}</td>
    <td class="px-6 py-4">

    <button type="button" class="edit-btn focus:outline-none text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">
    <svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
    <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
    <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
  </svg>
      </button>

    <button type="button" class="del-btn focus:outline-none text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
  <svg class="w-4 h-4 del-svg text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
  </svg>
    </button>
    </td>
  `;

  // update name partially - place input when dblclick on name or phone number
  const nameCell = row.querySelector(".name-cell");

  nameCell.addEventListener("dblclick", () => {
    const currentText = nameCell.innerText;
    const currentId = nameCell.closest("tr").getAttribute("contact-id");

    const input = document.createElement("input");
    input.className = "border-2 border-blue-500 p-2 rounded-lg";
    input.value = currentText;
    nameCell.innerHTML = ""; // clearing out existing value
    nameCell.append(input);

    input.addEventListener("blur", () => {
      const currentInputValue = input.value;

      fetch(baseUrl + "/contacts/" + currentId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentInputValue, // json server dta update
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      nameCell.innerText = currentInputValue; // UI update
    });

    // enter
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const currentInputValue = input.value;

        fetch(baseUrl + "/contacts/" + currentId, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: currentInputValue, // json server dta update
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));

        nameCell.innerText = currentInputValue; // UI update
      }
    });
  });

  // update number partially - place input when dblclick on phone number
  const phoneCell = row.querySelector(".phone-cell");

  phoneCell.addEventListener("dblclick", () => {
    const currentText = phoneCell.innerText;
    const currentId = phoneCell.closest("tr").getAttribute("contact-id");

    const input = document.createElement("input");
    input.className = "border-2 border-blue-500 p-2 rounded-lg";
    input.value = currentText;
    phoneCell.innerHTML = ""; // clearing out existing value
    phoneCell.append(input);

    input.addEventListener("blur", () => {
      const currentInputValue = input.value;

      fetch(baseUrl + "/contacts/" + currentId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phNumber: currentInputValue, // json server dta update
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      phoneCell.innerText = currentInputValue; // UI update
    });

    // enter
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const currentInputValue = input.value;

        fetch(baseUrl + "/contacts/" + currentId, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phNumber: currentInputValue, // json server dta update
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));

        phoneCell.innerText = currentInputValue; // UI update
      }
    });
  });

  return row;
};

export const renderContact = (contacts) => {
  rows.innerHTML = "";
  contacts.forEach((contact) => {
    rows.append(createContactRow(contact));
  });
};

// GET method
export const fetchContact = (url) => {
  fetch(baseUrl + url)
    .then((res) => res.json())
    .then((data) => renderContact(data));
};

// delete row
export const removeContact = (id) => {
  const currentRow = document.querySelector(`[contact-id="${id}"]`);
  currentRow.classList.add("opacity-20");

  fetch(baseUrl + "/contacts/" + id, {
    method: "DELETE",
  }).then((res) => {
    if (res.status === 204) {
      currentRow.remove();
    }
  });
};

// edit row
export const updateContact = async (id) => {
  const currentRow = document.querySelector(`[contact-id="${id}"]`);

  drawer.show();

  const response = await fetch(baseUrl + "/contacts/" + id);
  const data = await response.json();

  updateContactForm.querySelector("#contactId").value = data.id;
  updateContactForm.querySelector("#nameUpdate").value = data.name;
  updateContactForm.querySelector("#numberUpdate").value = data.phNumber;

  // undoing button disabled after input data arrive
  updateContactForm.querySelector("button").disabled = false;
};

// update Form Handler
export const updateContactFormHandler = (event) => {
  event.preventDefault();

  const formData = new FormData(updateContactForm);

  // UPDATE method
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id: formData.get("id"),
    name: formData.get("name"),
    phNumber: formData.get("number"),
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(baseUrl + "/contacts/" + formData.get("id"), requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // rows.innerHTML = "";
      fetchContact("/contacts");
      drawer.toggle();
    });
};

// handle row
export const rowsHandler = (event) => {
  // delete row
  if (event.target.classList.contains("del-btn")) {
    removeContact(event.target.closest("tr").getAttribute("contact-id"));
  }
  // update row
  else if (event.target.classList.contains("edit-btn")) {
    updateContact(event.target.closest("tr").getAttribute("contact-id"));
  }
};
