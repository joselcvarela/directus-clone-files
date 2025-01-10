declare global {
  interface DirectusFile {
    id: string;
    filename_download: string;
    filesize: string;
    type: string;
    folder: string;
  }
}

export {};
