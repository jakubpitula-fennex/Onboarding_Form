import { FnxAlert, FnxAlertContent, FnxButton, FnxText } from "fennexui";
import * as React from "react";
import { DeleteCustomerModalProps } from "../../../../types/CustomerTypes";

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  deleteAlertOpen,
  setDeleteAlertOpen,
  setDeletionConfirmed,
}) => {
  return (
    <FnxAlert
      open={deleteAlertOpen}
      onClose={() => setDeleteAlertOpen(false)}
      title="Confirm Deletion"
      className="alert"
    >
      <FnxAlertContent>
        <FnxText>Are you sure you want to delete this customer?</FnxText>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <FnxButton
            className="dangerButton buttons"
            onClick={() => {
              setDeletionConfirmed(true);
              setDeleteAlertOpen(false);
            }}
            type="button"
          >
            Delete
          </FnxButton>
          <FnxButton
            className="secondaryButton buttons"
            onClick={() => setDeleteAlertOpen(false)}
            type="button"
          >
            Cancel
          </FnxButton>
        </div>
      </FnxAlertContent>
    </FnxAlert>
  );
};

export default DeleteCustomerModal;
