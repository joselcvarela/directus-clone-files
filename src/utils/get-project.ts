import axios, { AxiosInstance } from "axios";
import { input_password, input_string, input_url } from "../services/prompt";

export async function get_project(direction: "Source" | "Destination") {
  const url = await input_url(`${direction} URL:`);
  if (!url) throw new Error(`${direction} URL is invalid`);

  const email = await input_string(`${direction} User Email:`);
  const password = await input_password(`${direction} User Password:`);

  const login_url = new URL(url);
  login_url.pathname = "/auth/login";

  const response = await axios
    .post(login_url.toString(), { email, password })
    .then((r) => r.data);

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
