import * as React from "react";
import { FnxModalPropsType } from "../../../types/uiTypes";

export const useModal = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalProps, setModalProps] =
    React.useState<Partial<FnxModalPropsType> | null>(null);

  const showModal = (title: string, content: string, onClose?: () => void) => {
    setModalOpen(true);
    setModalProps({
      title,
      content,
      dismissButtonText: "Okay",
      onClose: () => {
        setModalOpen(false);
        if (onClose) onClose();
      },
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return { modalOpen, modalProps, showModal, closeModal };
};
