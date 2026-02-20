import { FnxButton, FnxListViewContainer, FnxTextField } from "fennexui";
import * as React from "react";
import { FIELD_LABELS } from "../../../../consts";
import { CustomerFormProps } from "../../../../types/CustomerTypes";

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formValues,
  handleChange,
  handleSave,
  handleDismiss,
  dismissButtonText,
  errors,
  disableSave = false,
}) => {
  return (
    <FnxListViewContainer>
      <form onClick={(e) => e.stopPropagation()}>
        {FIELD_LABELS.map((field) => (
          <div key={field.name} style={{ marginBottom: 10, textAlign: "left" }}>
            <FnxTextField
              value={formValues[field.name]}
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
            onClick={handleDismiss}
            type="button"
          >
            {dismissButtonText}
          </FnxButton>
        </div>
      </form>
    </FnxListViewContainer>
  );
};

export default CustomerForm;
