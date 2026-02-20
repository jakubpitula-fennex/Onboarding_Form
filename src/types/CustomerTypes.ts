export type CustomerType = {
  id: number;
  name: string;
  address: string;
  noRigs: number;
  noJackups: number;
  noModus: number;
  siteUrl: string;
};

export type CustomerTypeWithoutId = Omit<CustomerType, "id">;

export type DeleteCustomerModalProps = {
  deleteAlertOpen: boolean;
  setDeleteAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletionConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CustomerFormProps = {
  formValues: CustomerTypeWithoutId;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value?: string,
  ) => void;
  handleSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDismiss: (e: React.MouseEvent<HTMLButtonElement>) => void;
  dismissButtonText: string;
  errors: Record<string, string>;
  disableSave?: boolean;
};
