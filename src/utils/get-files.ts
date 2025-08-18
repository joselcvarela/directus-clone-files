import type { AxiosResponse } from "axios";

interface Params {
  chunkSize?: number;
}

export async function* get_files(project: Project, params: Params) {
  let response: AxiosResponse<DirectusFile[]>;
  const MAX = params.chunkSize || 10;
  let page = 1;

  do {
    response = await project.axios
      .get("/files", {
        params: {
          fields: ["id", "filename_download", "filesize", "type", "folder"],
          limit: MAX,
          sort: "id",
          page: page++,
        },
      })
      .then((r) => r.data);

    yield response.data;
  } while (response?.data?.length === MAX);
}
