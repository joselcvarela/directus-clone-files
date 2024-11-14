export async function import_file(
  file: DirectusFile,
  source: Project,
  destination: Project
) {
  const exists = await destination.axios
    .get("/files", {
      params: {
        fields: ["id"],
        filter: {
          filename_download: { _eq: file.filename_download },
          filesize: { _eq: file.filesize },
        },
      },
    })
    .then((r) => {
      return (r.data?.data?.length ?? 0) > 0;
    });

  if (exists) return;

  const source_asset_url = new URL(source.url);
  source_asset_url.pathname = `/assets/${file.id}`;
  source_asset_url.searchParams.set("access_token", source.token);

  const imported = await destination.axios.post(
    "/files/import",
    {
      url: source_asset_url.toString(),
      data: {
        id: file.id,
        type: file.type,
        filename_download: file.filename_download,
        folder: destination.folder_id,
      },
    },
    { headers: { Authorization: `Bearer ${destination.token}` } }
  );

  return imported.data.data;
}
