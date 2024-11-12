import { get_project, logout, sleep, import_file } from "./utils";
import { get_files } from "./utils/get-files";

async function start() {
  const source = await get_project("Source");
  const destination = await get_project("Destination");

  for await (const chunk of get_files(source)) {
    await Promise.all(
      chunk.map((file) => import_file(file, source, destination))
    );
    await sleep(250);
  }

  await logout(source);
  await logout(destination);
}

start();
