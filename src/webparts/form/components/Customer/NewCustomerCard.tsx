import * as React from "react";
import { FnxButton, FnxModalMessage } from "fennexui";
import {
  CustomerType,
  CustomerTypeWithoutId,
} from "../../../../types/CustomerTypes";
import { validateField } from "../../utils/validation";
import CustomerForm from "./CustomerForm";
import { useModal } from "../../hooks/useModal";

const NewCustomerCard: React.FC<{
  dbUrl: string;
  setItems: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}> = ({ dbUrl, setItems }) => {
  const initialFormValues = {
    name: "",
    address: "",
    noRigs: 0,
    noJackups: 0,
    noModus: 0,
    siteUrl: "https://",
  };
  const [formValues, setFormValues] =
    React.useState<CustomerTypeWithoutId>(initialFormValues);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [disableSave, setDisableSave] = React.useState<boolean>(false);

  const { modalOpen, modalProps, showModal } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    const errorMessage = validateField(name, value);

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setDisableSave(true); // To prevent double clicks resulting in multiple entries

    e.preventDefault();
    e.stopPropagation();

    if (
      Object.values(formValues).some(
        (value) => typeof value === "string" && value.trim() === "",
      )
    ) {
      showModal("Validation Error", "Please fill in all the fields.");
      setDisableSave(false);
      return;
    }

    if (Object.values(errors).some((error) => error !== "")) {
      showModal("Validation Error", "Please fix the errors before saving.");
      setDisableSave(false);
      return;
    }

    try {
      const res = await fetch(dbUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setItems((prev: CustomerType[]) => [
        ...prev,
        {
          id: data.id,
          ...formValues,
        },
      ]);

      showModal("Success", "Item saved successfully.");

      setFormValues(initialFormValues);
      setErrors({});
      setExpanded(false);
      setDisableSave(false);
    } catch (error) {
      console.error("Error saving item:", error);
      showModal(
        "Error",
        `An error occurred while saving the item:\n${error}.\nPlease try again.`,
      );

      setDisableSave(false);
    }
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setExpanded(false);
    setFormValues(initialFormValues);
    setErrors({});
    setDisableSave(false);
  };
  return (
    <>
      <FnxButton
        className="primaryButton buttons w-100 mx-0 my-2"
        onClick={() => setExpanded(!expanded)}
      >
        Add New Customer
      </FnxButton>
      {expanded && (
        <CustomerForm
          formValues={formValues}
          handleChange={handleChange}
          handleSave={handleSave}
          handleDismiss={handleCancel}
          dismissButtonText="Cancel"
          errors={errors}
          disableSave={disableSave}
        />
      )}
      <FnxModalMessage {...modalProps} open={modalOpen}></FnxModalMessage>
    </>
  );
};

export default NewCustomerCard;
