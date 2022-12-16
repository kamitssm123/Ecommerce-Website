import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant} className="text-center w-75 m-auto my-5">
      {children}
    </Alert>
  );
};

export default Message;
