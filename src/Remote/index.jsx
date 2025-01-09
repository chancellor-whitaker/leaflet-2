import { RemoteComponent } from "./RemoteComponent";
import { url as link } from "./url";

const Remote = ({ url, ...rest }) => (
  <RemoteComponent url={link} {...rest}></RemoteComponent>
);

export default Remote;
