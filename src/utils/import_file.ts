export async function import_file(
  file: DirectusFile,
  source: Project,
  destination: Project
) {
  const exists = await destination.axios
    .head("/files", {
      params: {
        filter: {
          filename_download: { _eq: file.filename_download },
          filesize: { _eq: file.filesize },
        },
      },
    })
    .then((r) => r.data?.data?.length > 0);

  if (exists) return;

  const source_file_url = new URL(source.url);
  source_file_url.pathname = `/files/${file.id}`;
  source_file_url.searchParams.set("access_token", source.token);

  const imported = await destination.axios.post(
    "/files/import",
    {
      url: source_file_url.toString(),
      data: {
        id: file.id,
      },
    },
    { headers: { Authorization: `Bearer ${destination.token}` } }
  );

  return imported.data;
}
