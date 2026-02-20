import * as React from "react";
import {
  FnxButton,
  FnxListViewContainer,
  FnxModalMessage,
  FnxTextField,
} from "fennexui";

const NewCustomerCard: React.FC<{
  dbUrl: string;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ dbUrl, setItems }) => {
  const [formValues, setFormValues] = React.useState({
    Name: "",
    Address: "",
    NoRigs: 0,
    NoJackups: 0,
    NoModus: 0,
    customerURL: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [modalProps, setModalProps] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [disableSave, setDisableSave] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";

    const isNanValue = isNaN(Number(value));

    if (name.startsWith("No")) {
      if (isNanValue || Number(value) < 0) {
        errorMessage = "This has to be a non-negative number.";
      }
    } else {
      if (value.trim() === "") {
        errorMessage = "This field is required.";
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: name.startsWith("No") && !isNanValue ? Number(value) : value,
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
      setModalOpen(true);
      setModalProps({
        title: "Validation Error",
        content: "Please fill in all the fields.",
        className: "alert",
        dismissButtonText: "Okay",
        onClose: () => setModalOpen(false),
      });
      setDisableSave(false);
      return;
    }

    if (Object.values(errors).some((error) => error !== "")) {
      setModalOpen(true);
      setModalProps({
        title: "Validation Error",
        content: "Please fix the errors before saving.",
        className: "alert",
        dismissButtonText: "Okay",
        onClose: () => setModalOpen(false),
      });
      setDisableSave(false);
      return;
    }

    try {
      const res = await fetch(dbUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.Name,
          address: formValues.Address,
          noRigs: formValues.NoRigs,
          noJackups: formValues.NoJackups,
          noModus: formValues.NoModus,
          siteURL: formValues.customerURL,
        }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setItems((prev) => [
        ...prev,
        {
          Id: data.id,
          Name: formValues.Name,
          Address: formValues.Address,
          NoRigs: formValues.NoRigs,
          NoJackups: formValues.NoJackups,
          NoModus: formValues.NoModus,
          siteURL: formValues.customerURL,
        },
      ]);

      setModalOpen(true);
      setModalProps({
        title: "Success",
        content: "Item saved successfully.",
        className: "alert",
        dismissButtonText: "Okay",
        onClose: () => setModalOpen(false),
      });

      setFormValues({
        Name: "",
        Address: "",
        NoRigs: 0,
        NoJackups: 0,
        NoModus: 0,
        customerURL: "",
      });
      setErrors({});
      setExpanded(false);
      setDisableSave(false);
    } catch (error) {
      console.error("Error saving item:", error);
      setDisableSave(false);
    }
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setExpanded(false);
    setFormValues({
      Name: "",
      Address: "",
      NoRigs: 0,
      NoJackups: 0,
      NoModus: 0,
      customerURL: "",
    });
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
        <FnxListViewContainer>
          <form onClick={(e) => e.stopPropagation()}>
            {[
              { label: "Name", value: formValues.Name, name: "Name" },
              { label: "Address", value: formValues.Address, name: "Address" },
              {
                label: "Number of rigs",
                value: formValues.NoRigs,
                name: "NoRigs",
              },
              {
                label: "Number of jack ups",
                value: formValues.NoJackups,
                name: "NoJackups",
              },
              {
                label: "Number of MODUs",
                value: formValues.NoModus,
                name: "NoModus",
              },
              {
                label: "Site URL",
                value: formValues.customerURL,
                name: "customerURL",
              },
            ].map((field) => (
              <div
                key={field.name}
                style={{ marginBottom: 10, textAlign: "left" }}
              >
                <FnxTextField
                  value={field.value}
                  name={field.name}
                  onChange={handleChange}
                  label={field.label}
                  size="small"
                  fullWidth
                  error={!!errors[field.name]}
                  helperText={errors[field.name] || ""}
                  variant="standard"
                />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-end",
                padding: 10,
              }}
            >
              <FnxButton
                className="primaryButton buttons"
                onClick={handleSave}
                type="button"
                disabled={disableSave}
              >
                Save
              </FnxButton>
              <FnxButton
                className="dangerButton buttons"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </FnxButton>
            </div>
          </form>
        </FnxListViewContainer>
      )}
      <FnxModalMessage {...modalProps} open={modalOpen}></FnxModalMessage>
    </>
  );
};

export default NewCustomerCard;
