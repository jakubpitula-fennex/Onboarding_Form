import * as React from "react";
import type { IFormProps } from "./IFormProps";
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";
import CustomerCard from "./CustomerCard";
import NewCustomerCard from "./NewCustomerCard";
import {
  FennexGreen,
  FnxHeader,
  FnxListViewContainer,
  FnxLoader,
  FnxText,
} from "fennexui";
import { ThemeProvider } from "styled-components";

type ListItem = {
  Id: number;
  Name: string;
  Address: string;
  NoRigs: number;
  NoJackups: number;
  NoModus: number;
  siteURL: string;
};

const Form: React.FC<IFormProps> = ({ siteUrl, spHttpClient }) => {
  const [items, setItems] = React.useState<ListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items?$select=Id,Title,field_1,field_2,field_3,field_4,SiteURL`;
      try {
        const res: SPHttpClientResponse = await spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const data = await res.json();
        console.log("Fetched items:", data.value);
        if (isMounted) {
          setItems(
            data.value.map((i: any) => ({
              Id: i.Id,
              Name: i.Title,
              Address: i.field_1,
              NoRigs: i.field_2,
              NoJackups: i.field_3,
              NoModus: i.field_4,
              siteURL: i.SiteURL,
            })) as ListItem[],
          );
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || "An error occured");
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
  }, [spHttpClient, siteUrl]);

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
                key={i.Id}
                Id={i.Id}
                Name={i.Name}
                Address={i.Address}
                NoRigs={i.NoRigs}
                NoJackups={i.NoJackups}
                NoModus={i.NoModus}
                customerURL={i.siteURL}
                spHttpClient={spHttpClient}
                siteUrl={siteUrl}
                setItems={setItems}
              />
            );
          })}
          <NewCustomerCard
            spHttpClient={spHttpClient}
            siteUrl={siteUrl}
            setItems={setItems}
          />
        </FnxListViewContainer>
      </div>
    </ThemeProvider>
  );
};

export default Form;
