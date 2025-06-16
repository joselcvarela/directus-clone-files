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

  const project = new Project(url);

  await project.login(email, password);

  return project;
}

export class Project {
  axios: AxiosInstance;
  token = "";
  refresh_token = "";
  expires_in_ms = 0;
  folder_id = "";
  refreshing = false;
  refresh_timeout: NodeJS.Timeout | null = null;

  constructor(public url: URL) {
    this.axios = axios.create({
      baseURL: url.toString(),
    });

    this.axios.interceptors.request.use(
      (config) => {
        if (this.token && config.use_auth !== false) {
          config.headers["Authorization"] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async set_token(auth: {
    access_token: string;
    refresh_token: string;
    expires: number;
  }) {
    const { access_token: token, refresh_token: refresh, expires } = auth;

    this.token = token;
    this.refresh_token = refresh;
    this.expires_in_ms = expires;

    this.refresh_timeout = setTimeout(
      () => this.refresh(),
      // Remove a percentage because we don't know what the value of ACCESS_TOKEN_TTL is (by default is 15min - 900000ms and 0.06 of that value is around 1min)
      Math.round(this.expires_in_ms - this.expires_in_ms * 0.06)
    );
  }

  async login(email: string, password: string) {
    const login_url = new URL(this.url);
    login_url.pathname = "/auth/login";

    const response = await axios
      .post(login_url.toString(), { email, password })
      .then((r) => r.data.data);

    await this.set_token(response);
  }

  async refresh() {
    if (this.refreshing) return;

    this.refreshing = true;

    const response = await this.axios
      .post(
        "/auth/refresh",
        { refresh_token: this.refresh_token },
        { use_auth: false }
      )
      .then((r) => r.data.data);

    await this.set_token(response);

    this.refreshing = false;
  }

  async logout() {
    await this.axios.post(
      "/auth/logout",
      { refresh_token: this.refresh_token },
      { use_auth: false }
    );

    if (this.refresh_timeout) clearTimeout(this.refresh_timeout);
  }
}
