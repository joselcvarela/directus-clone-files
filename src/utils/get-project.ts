import axios, { AxiosInstance } from "axios";
import { input_password, input_string } from "../services/prompt";

const OPTIONS = {
  url: "",
  email: "",
  password: "",
};

export async function get_project(
  direction: "Source" | "Destination",
  options = OPTIONS
) {
  const url = await Promise.resolve()
    .then(() => options.url ?? input_string(`${direction} URL:`))
    .then((url) => new URL(url))
    .catch(() => null);
  if (!url) throw new Error(`${direction} URL is invalid`);
  if (options.url) console.log(`${direction} URL: ${options.url}`);

  const email =
    options.email ?? (await input_string(`${direction} User Email:`));
  if (options.email) console.log(`${direction} Email: ${options.email}`);

  const password =
    options.password ?? (await input_password(`${direction} User Password:`));
  if (options.password)
    console.log(
      `${direction} Password: ${options.password.replace(/./g, "*")}`
    );

  const login_url = new URL(url);
  login_url.pathname = "/auth/login";

  const response = await axios
    .post(login_url.toString(), { email, password })
    .then((r) => r.data.data);

  const { access_token: token, refresh_token: refresh } = response;

  return new Project(url, token, refresh);
}

export async function logout(project: Project) {
  await project.axios.post("/auth/logout", {
    refresh_token: project.refresh,
  });
}

export class Project {
  axios: AxiosInstance;
  folder_id = "";

  constructor(
    public url: URL,
    public token: string,
    public refresh: string
  ) {
    this.axios = axios.create({
      baseURL: url.toString(),
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
