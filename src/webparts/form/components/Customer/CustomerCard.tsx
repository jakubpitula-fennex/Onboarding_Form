import * as React from "react";
import {
  FnxAccordion,
  FnxAccordionDetails,
  FnxAccordionSummary,
  FnxModalMessage,
} from "fennexui";
import {
  CustomerType,
  CustomerTypeWithoutId,
} from "../../../../types/CustomerTypes";
import { FnxModalPropsType } from "../../../../types/uiTypes";
import { DeleteCustomerModal } from "./DeleteCustomerModal";
import { validateField } from "../../utils/validation";
import CustomerForm from "./CustomerForm";

const CustomerCard: React.FC<{
  customer: CustomerType;
  dbUrl: string;
  setItems: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}> = ({ customer, dbUrl, setItems }) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [modalProps, setModalProps] =
    React.useState<Partial<FnxModalPropsType> | null>(null);
  const [deletionConfirmed, setDeletionConfirmed] =
    React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState<boolean>(false);

  const [formValues, setFormValues] = React.useState<CustomerTypeWithoutId>({
    name: customer.name,
    address: customer.address,
    noRigs: customer.noRigs,
    noJackups: customer.noJackups,
    noModus: customer.noModus,
    siteUrl: customer.siteUrl,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value?: string,
  ) => {
    const name = e.target.name;
    const fieldValue = value ?? e.target.value;

    const errorMessage = validateField(name, fieldValue);

    setFormValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (Object.values(errors).some((error) => error !== "")) {
      setModalOpen(true);
      setModalProps({
        title: "Validation Error",
        content: "Please fix the errors before saving.",
        className: "alert",
        dismissButtonText: "Okay",
        onClose: () => setModalOpen(false),
      });
      return;
    }

    try {
      const res = await fetch(`${dbUrl}/${customer.id}`, {
        method: "PUT",
        headers: {
          "If-Match": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customer.id,
          ...formValues,
        }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      setItems((prev) =>
        prev.map((item) =>
          item.id === customer.id ? { id: customer.id, ...formValues } : item,
        ),
      );
      setExpanded(false);

      setModalOpen(true);
      setModalProps({
        title: "Success",
        content: "Item saved successfully.",
        className: "alert",
        dismissButtonText: "Okay",
        onClose: () => setModalOpen(false),
      });
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDeleteAlertOpen(true);
  };

  React.useEffect(() => {
    if (deletionConfirmed) {
      const deleteItem = async () => {
        try {
          const res = await fetch(`${dbUrl}/${customer.id}`, {
            method: "DELETE",
            headers: {
              "If-Match": "*",
            },
          });
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

          setModalOpen(true);

          setModalProps({
            title: "Success",
            content: "Item deleted successfully.",
            className: "alert",
            dismissButtonText: "Okay",
            onClose: () => {
              setModalOpen(false);
              setItems((prev) =>
                prev.filter((item) => item.id !== customer.id),
              );
            },
          });
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      };

      deleteItem();
      setDeletionConfirmed(false);
    }
  }, [deletionConfirmed]);

  return (
    <>
      <FnxAccordion
        expanded={expanded}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <FnxAccordionSummary>{customer.name}</FnxAccordionSummary>
        <FnxAccordionDetails>
          <CustomerForm
            formValues={formValues}
            handleChange={handleChange}
            handleSave={handleSave}
            handleDismiss={handleDelete}
            dismissButtonText="Delete"
            errors={errors}
          />
        </FnxAccordionDetails>
      </FnxAccordion>
      <FnxModalMessage {...modalProps} open={modalOpen}></FnxModalMessage>
      <DeleteCustomerModal
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        setDeletionConfirmed={setDeletionConfirmed}
      />
    </>
  );
};

export default CustomerCard;
