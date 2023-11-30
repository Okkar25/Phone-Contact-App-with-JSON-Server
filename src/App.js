import {
  contactCreateFormHandler,
  fetchContact,
  rowsHandler,
  updateContactFormHandler,
} from "./app/contact";
import { createContactForm, rows, updateContactForm } from "./core/selectors";

class App {
  listener() {
    createContactForm.addEventListener("submit", contactCreateFormHandler);

    rows.addEventListener("click", rowsHandler);

    updateContactForm.addEventListener("submit", updateContactFormHandler);
  }

  initialRender() {
    fetchContact("/contacts");
  }

  init() {
    console.log("App starts");

    this.listener();

    this.initialRender();
  }
}

export default App;
      