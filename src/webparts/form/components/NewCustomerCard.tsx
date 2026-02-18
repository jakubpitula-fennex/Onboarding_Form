import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";
import {
  FnxButton,
  FnxListViewContainer,
  FnxModalMessage,
  FnxText,
  FnxTextField,
} from "fennexui";

const NewCustomerCard: React.FC<{
  spHttpClient: SPHttpClient;
  siteUrl: string;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ spHttpClient, siteUrl, setItems }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name.startsWith("No")) {
      if (isNaN(Number(value)) || Number(value) < 0) {
        errorMessage = "Please enter a valid non-negative number";
      }
    } else {
      if (value.trim() === "") {
        errorMessage = "This field is required.";
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: name.startsWith("No") ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      return;
    }

    const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items`;
    try {
      const res = await spHttpClient.post(url, SPHttpClient.configurations.v1, {
        body: JSON.stringify({
          Title: formValues.Name,
          field_1: formValues.Address,
          field_2: formValues.NoRigs,
          field_3: formValues.NoJackups,
          field_4: formValues.NoModus,
          SiteURL: formValues.customerURL,
        }),
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setItems((prev) => [
        ...prev,
        {
          Id: data.Id,
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
    } catch (error) {
      console.error("Error saving item:", error);
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
                  type={field.name.startsWith("No") ? "number" : "text"}
                  value={field.value}
                  name={field.name}
                  onChange={handleChange}
                  label={field.label}
                  size="small"
                  fullWidth
                />
                <FnxText
                  style={{
                    color: "red",
                    marginTop: 5,
                    marginBottom: -5,
                    marginLeft: 3,
                    fontSize: 12,
                    minHeight: 16,
                  }}
                >
                  {errors[field.name] || ""}
                </FnxText>
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
