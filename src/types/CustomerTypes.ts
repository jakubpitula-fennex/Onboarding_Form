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
