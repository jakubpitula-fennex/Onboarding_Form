import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";

const CustomerCard: React.FC<{
  Id: number;
  Name: string;
  Address: string;
  NoRigs: number;
  NoJackups: number;
  NoModus: number;
  customerURL: string;
  setOpenItems: React.Dispatch<React.SetStateAction<number[]>>;
  openItems: number[];
  spHttpClient: SPHttpClient;
  siteUrl: string;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({
  Id,
  Name,
  Address,
  NoRigs,
  NoJackups,
  NoModus,
  customerURL,
  setOpenItems,
  openItems,
  spHttpClient,
  siteUrl,
  setItems,
}) => {
  const isOpen = openItems.indexOf(Id) !== -1;

  const [formValues, setFormValues] = React.useState({
    Name,
    Address,
    NoRigs,
    NoJackups,
    NoModus,
    customerURL,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

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

    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors before saving.");
      return;
    }

    const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items(${Id})`;
    try {
      await spHttpClient.post(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json",
          "X-HTTP-Method": "MERGE",
          "If-Match": "*",
        },
        body: JSON.stringify({
          Title: formValues.Name,
          field_1: formValues.Address,
          field_2: formValues.NoRigs,
          field_3: formValues.NoJackups,
          field_4: formValues.NoModus,
          SiteURL: formValues.customerURL,
        }),
      });

      alert("Item saved successfully!");
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this customer?")) {
      const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items(${Id})`;
      try {
        await spHttpClient.post(url, SPHttpClient.configurations.v1, {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-Type": "application/json",
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        });
        alert("Item deleted successfully!");
        setOpenItems(openItems.filter((id) => id !== Id));
        setItems((prev) => prev.filter((item) => item.Id !== Id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div
      key={Id}
      style={{
        backgroundColor: "#6ca2ad",
        padding: 5,
        marginBottom: 5,
        borderRadius: 5,
        cursor: "pointer",
        transition: "0.2s ease",
      }}
      onClick={() =>
        setOpenItems(
          isOpen ? openItems.filter((id) => id !== Id) : [...openItems, Id],
        )
      }
    >
      <h3>{Name}</h3>
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
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerCard;
