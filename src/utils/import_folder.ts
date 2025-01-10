export async function import_folder(
  folder: DirectusFolder,
  source: Project,
  destination: Project
) {
  const exists = await destination.axios
    .get("/folders", {
      params: {
        fields: ["id"],
        filter: {
          id: { _eq: folder.id },
        },
      },
    })
    .then((r) => {
      return (r.data?.data?.length ?? 0) > 0;
    });

  if (exists) return;

  const imported = await destination.axios.post(
    "/folders",
    {
      id: folder.id,
      name: folder.name,
      parent: folder.parent ? folder.parent : destination.folder_id,
    },
    { headers: { Authorization: `Bearer ${destination.token}` } }
  );

  return imported.data.data;
}
