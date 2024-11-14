import inquirer from "inquirer";

export async function input_string(message: string) {
  return inquirer
    .prompt([{ message, type: "input", name: "value" }])
    .then((r) => r.value as string);
}

export async function input_password(message: string) {
  return inquirer
    .prompt([{ message, type: "password", name: "value" }])
    .then((r) => r.value as string);
}
