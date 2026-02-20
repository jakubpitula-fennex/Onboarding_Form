import * as React from "react";
import type { IFormProps } from "./IFormProps";
import CustomerCard from "./Customer/CustomerCard";
import NewCustomerCard from "./Customer/NewCustomerCard";
import {
  FennexGreen,
  FnxHeader,
  FnxListViewContainer,
  FnxLoader,
  FnxText,
} from "fennexui";
import { ThemeProvider } from "styled-components";
import { CustomerType } from "../../../types/CustomerTypes";

const Form: React.FC<IFormProps> = () => {
  const [items, setItems] = React.useState<CustomerType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const dbUrl = "https://localhost:7165/api/customers";

  React.useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(dbUrl);

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const data = await res.json();

        if (isMounted) {
          setItems(data as CustomerType[]);
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [dbUrl]);

  return (
    <ThemeProvider theme={FennexGreen}>
      <div style={{ textAlign: "center" }}>
        <FnxHeader>Edit customer data</FnxHeader>
        {loading && <FnxLoader ariaLive="polite" label="Loading..." size={2} />}
        {error && <FnxText>Error: {error}</FnxText>}
        <FnxListViewContainer>
          {items.map((i) => {
            return (
              <CustomerCard
                key={i.id}
                customer={i}
                dbUrl={dbUrl}
                setItems={setItems}
              />
            );
          })}
          <NewCustomerCard dbUrl={dbUrl} setItems={setItems} />
        </FnxListViewContainer>
      </div>
    </ThemeProvider>
  );
};

export default Form;
