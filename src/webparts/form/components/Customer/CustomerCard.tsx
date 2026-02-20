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
import { DeleteCustomerModal } from "./DeleteCustomerModal";
import { validateField } from "../../utils/validation";
import CustomerForm from "./CustomerForm";
import { useModal } from "../../hooks/useModal";

const CustomerCard: React.FC<{
  customer: CustomerType;
  dbUrl: string;
  setItems: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}> = ({ customer, dbUrl, setItems }) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [deletionConfirmed, setDeletionConfirmed] =
    React.useState<boolean>(false);
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

  const { modalOpen, modalProps, showModal } = useModal();

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
      showModal("Validation Error", "Please fix the errors before saving.");
      return;
    }

    try {
      const res = await fetch(`${dbUrl}/${customer.id}`, {
        method: "PUT",
        headers: {
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
      showModal("Success", "Item saved successfully.");
    } catch (error) {
      console.error("Error saving item:", error);
      showModal(
        "Error",
        `An error occurred while saving the item:\n${error}.\nPlease try again.`,
      );
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
          });
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          showModal("Success", "Item deleted successfully.", () => {
            setItems((prev) => prev.filter((item) => item.id !== customer.id));
          });
        } catch (error) {
          console.error("Error deleting item:", error);
          showModal(
            "Error",
            `An error occurred while deleting the item:\n${error}.\nPlease try again.`,
          );
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
