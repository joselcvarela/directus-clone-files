import { get_folders } from "src/utils/get-folders";
import { get_project, logout, sleep, import_file } from "../utils";
import { get_files } from "../utils/get-files";
import { import_folder } from "src/utils/import_folder";

const OPTIONS = {
  source_url: "",
  source_email: "",
  source_password: "",
  destination_url: "",
  destination_email: "",
  destination_password: "",
  wait: "250",
};

async function sync(options = OPTIONS) {
  const wait_between_chunks = await Promise.resolve()
    .then(() => parseInt(options.wait))
    .catch(() => Number(OPTIONS.wait));

  const source = await get_project("Source", {
    url: options.source_url,
    email: options.source_email,
    password: options.source_password ?? process.env.SOURCE_PASSWORD,
  });

  const destination = await get_project("Destination", {
    url: options.destination_url,
    email: options.destination_email,
    password: options.destination_password ?? process.env.DESTINATION_PASSWORD,
  });

  if (!destination.folder_id) {
    const folder = await destination.axios
      .post("/folders", {
        name: `Imported ${new Date().toLocaleDateString()}`,
      })
      .then((r) => r.data.data);

    destination.folder_id = folder.id;
  }

  console.log("Starting importing folders (ordered by ID)...");
  for await (const chunk of get_folders(source)) {
    await Promise.all(
      chunk.map((folder) => import_folder(folder, source, destination))
    );

    console.log(`Imported ${chunk[0].id}, 9+`);
    await sleep(wait_between_chunks);
  }

  console.log("Starting importing files (ordered by ID)...");
  for await (const chunk of get_files(source)) {
    await Promise.all(
      chunk.map((file) => import_file(file, source, destination))
    );

    console.log(`Imported ${chunk[0].id}, 9+`);
    await sleep(wait_between_chunks);
  }
  console.log("Finished");

  console.log("Logging out...");

  await logout(source);
  await logout(destination);

  console.log("Done");
}

export const sync_command = {
  options: [
    [
      "--source_url <source>",
      "Directus Project URL where assets will be pulled",
    ],
    [
      "--source_email <email>",
      "Directus User Email with access to read assets/files",
    ],
    [
      "--destination_url <url>",
      "Directus Project URL where assets will be pushed",
    ],
    [
      "--destination_email <email>",
      "Directus User Email with access to create and read assets/files",
    ],
    ["--wait <wait>", "Time to wait between chunks"],
  ],
  action: async (options: any) => {
    await sync(options);
  },
};
