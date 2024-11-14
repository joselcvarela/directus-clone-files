import type { AxiosResponse } from "axios";

export async function* get_files(project: Project) {
  let response: AxiosResponse<DirectusFile[]>;
  const MAX = 10;
  let page = 1;

  do {
    response = await project.axios
      .get("/files", {
        params: {
          fields: ["id", "filename_download", "filesize", "type"],
          limit: MAX,
          sort: "id",
          page: page++,
        },
      })
      .then((r) => r.data);

    yield response.data;
  } while (response?.data?.length === MAX);
}
