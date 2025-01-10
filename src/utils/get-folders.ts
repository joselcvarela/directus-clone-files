import type { AxiosResponse } from "axios";

export async function* get_folders(project: Project) {
  let response: AxiosResponse<DirectusFolder[]>;
  const MAX = 10;
  let page = 1;

  do {
    response = await project.axios
      .get("/folders", {
        params: {
          fields: ["id", "name", "parent"],
          limit: MAX,
          sort: "id",
          page: page++,
        },
      })
      .then((r) => r.data);

    yield response.data;
  } while (response?.data?.length === MAX);
}
