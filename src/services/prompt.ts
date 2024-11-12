import inquirer from "inquirer";

export async function input_string(message: string) {
  return inquirer
    .prompt([{ message, type: "input", name: "value" }])
    .then((r) => r.value as string);
}

export async function input_url(message: string) {
  return await input_string(message)
    .then((r) => new URL(r))
    .catch(() => null);
}

export async function input_password(message: string) {
  return inquirer
    .prompt([{ message, type: "password", name: "value" }])
    .then((r) => r.value as string);
}
