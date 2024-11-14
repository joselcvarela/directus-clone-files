# Copy assets between two Directus projects

This tool allows you to copy assets from one project to another keeping the same ID.
This is useful if you are Exporting/Importing data that include relations to Directus Files but those files are not on destination.

## Usage

These tool can work in two different ways:

### Interactive

In this mode, the tool will ask for the information needed

```sh
$ npx directus-clone-files
```

### Non Interactive

In this mode, you pass the required information via options and environment variables:

```sh
SOURCE_PASSWORD=password DESTINATION_PASSWORD=password npx directus-clone-files --source_url https://source.example.com --source_email john@example.com --destination_url https://destination.example.com --destination_email john@example.com
```

## Notes

All files will be imported to a folder named `Imported (YYYY-MM-dd HH:mm)`.
In case something goes wrong, you can delete the imported using:

```json
{
  "filter": { "folder": { "name": { "_eq": "Imported (YYYY-MM-dd HH:mm)" } } }
}
```
