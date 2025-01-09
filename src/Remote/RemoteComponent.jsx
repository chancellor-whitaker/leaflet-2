import {
  createRemoteComponent,
  createRequires,
} from "@paciolan/remote-component";
import React from "react";

export const RemoteComponent = createRemoteComponent({
  requires: createRequires({ react: React }),
});
