import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";

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
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

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
      alert("Please fill in all the fields.");
      return;
    }

    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors before saving.");
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

      alert("Item saved successfully!");

      setFormValues({
        Name: "",
        Address: "",
        NoRigs: 0,
        NoJackups: 0,
        NoModus: 0,
        customerURL: "",
      });
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsOpen(false);
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
    <div
      style={{
        backgroundColor: "#25b167",
        padding: 5,
        marginBottom: 5,
        borderRadius: 5,
        cursor: "pointer",
        color: "white",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3>Add New Customer</h3>
      {isOpen && (
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
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                padding: 10,
                gap: 20,
              }}
            >
              <div style={{ width: "25%", textAlign: "left" }}>
                <p style={{ fontWeight: "bold", margin: 0 }}>{field.label}</p>
              </div>
              <div
                style={{
                  width: "60%",
                  textAlign: "left",
                  alignContent: "center",
                }}
              >
                <input
                  type={field.name.startsWith("No") ? "number" : "text"}
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  min={0}
                />
                <p
                  style={{
                    color: "red",
                    marginTop: 5,
                    marginBottom: -5,
                    fontSize: 12,
                    minHeight: 16,
                  }}
                >
                  {errors[field.name] || ""}
                </p>
              </div>
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
            <button
              style={{ backgroundColor: "green", color: "white" }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewCustomerCard;
