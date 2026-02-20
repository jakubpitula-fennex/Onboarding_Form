import FnxModalMessageProps from "fennexui/dist/components/FnxModalMessage/FnxModalMessage.types";

export type FnxModalPropsType = FnxModalMessageProps & {
  content: string; // To fix what I think is a bug with the FnxModalMessageProps type
};
