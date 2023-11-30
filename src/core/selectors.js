import { Drawer } from "flowbite";

export const app = document.querySelector("#app");
export const createContactForm = app.querySelector("#createContactForm");
export const rows = app.querySelector("#rows");
export const drawerUi = app.querySelector("#drawer-right-example");
export const updateContactForm = app.querySelector("#updateContactForm");

export const drawer = new Drawer(drawerUi, {
  placement: "right",
  backdrop: true,
  // bodyScrolling: false,
  // edge: true,
  // edgeOffset: "",
  // backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
});
