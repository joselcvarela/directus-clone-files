import type { AxiosResponse } from "axios";

export async function* get_files(project: Project) {
  let response: AxiosResponse<DirectusFile[]>;
  const MAX = 10;

  do {
    response = await project.axios.get("/files", {
      params: {
        fields: ["id", "filename_download", "filesize"],
      },
    });

    yield response.data;
  } while (response?.data?.length === MAX);
}
