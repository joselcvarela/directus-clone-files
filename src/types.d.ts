// axiosConfig.d.ts or wherever your types live
import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    use_auth?: boolean;
  }
}
