import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";
import {
  FnxAccordion,
  FnxAccordionDetails,
  FnxAccordionSummary,
  FnxAlert,
  FnxAlertContent,
  FnxButton,
  FnxListViewContainer,
  FnxModalMessage,
  FnxText,
  FnxTextField,
} from "fennexui";

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
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [modalProps, setModalProps] = React.useState<any>(null);
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);

  const [formValues, setFormValues] = React.useState({
    Name,
    Address,
    NoRigs,
    NoJackups,
    NoModus,
    customerURL,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value?: string,
  ) => {
    const name = e.target.name;
    const fieldValue = value ?? e.target.value;
    let errorMessage = "";

    if (name.startsWith("No")) {
      if (isNaN(Number(fieldValue)) || Number(fieldValue) < 0) {
        errorMessage = "Please enter a valid non-negative number";
      }
    } else {
      if (fieldValue.trim() === "") {
        errorMessage = "This field is required.";
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: name.startsWith("No") ? Number(fieldValue) : fieldValue,
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

    const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items(${Id})`;
    try {
      const res = await spHttpClient.post(url, SPHttpClient.configurations.v1, {
        headers: {
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

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

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
        const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items(${Id})`;
        try {
          const res = await spHttpClient.post(
            url,
            SPHttpClient.configurations.v1,
            {
              headers: {
                "X-HTTP-Method": "DELETE",
                "If-Match": "*",
              },
            },
          );
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

          setModalOpen(true);

          setModalProps({
            title: "Success",
            content: "Item deleted successfully.",
            className: "alert",
            dismissButtonText: "Okay",
            onClose: () => {
              setModalOpen(false);
              setOpenItems(openItems.filter((id) => id !== Id));
              setItems((prev) => prev.filter((item) => item.Id !== Id));
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
        <FnxAccordionSummary>{Name}</FnxAccordionSummary>
        <FnxAccordionDetails>
          <FnxListViewContainer>
            <form onClick={(e) => e.stopPropagation()}>
              {[
                { label: "Name", value: formValues.Name, name: "Name" },
                {
                  label: "Address",
                  value: formValues.Address,
                  name: "Address",
                },
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
                      color: "red !important",
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
                  onClick={handleDelete}
                  type="button"
                >
                  Delete
                </FnxButton>
              </div>
            </form>
          </FnxListViewContainer>
        </FnxAccordionDetails>
      </FnxAccordion>
      <FnxModalMessage {...modalProps} open={modalOpen}></FnxModalMessage>
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
              justifyContent: "flex-end",
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
    </>
  );
};

export default CustomerCard;
