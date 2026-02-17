import * as React from "react";
import styles from "./Form.module.scss";
import type { IFormProps } from "./IFormProps";
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";
import CustomerCard from "./CustomerCard";

type ListItem = {
  Id: number;
  Name: string;
  Address: string;
  NoRigs: number;
  NoJackups: number;
  NoModus: number;
};

const Form: React.FC<IFormProps> = ({
  hasTeamsContext,
  siteUrl,
  spHttpClient,
}) => {
  const [items, setItems] = React.useState<ListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const url = `${siteUrl}/_api/web/lists/GetByTitle('Customers')/items?$select=Id,Title,field_1,field_2,field_3,field_4`;
      try {
        const res: SPHttpClientResponse = await spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const data = await res.json();
        if (isMounted) {
          setItems(
            data.value.map((i: any) => ({
              Id: i.Id,
              Name: i.Title,
              Address: i.field_1,
              NoRigs: i.field_2,
              NoJackups: i.field_3,
              NoModus: i.field_4,
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
    <section
      className={`${styles.form} ${hasTeamsContext ? styles.teams : ""}`}
    >
      <div className={styles.welcome}>
        <h2>Edit customer data</h2>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <div>
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
                setOpenItems={setOpenItems}
                openItems={openItems}
              />
            );
          })}
          <div
            style={{
              backgroundColor: "#25b167",
              padding: 5,
              marginBottom: 5,
              borderRadius: 5,
              cursor: "pointer",
              color: "white",
            }}
          >
            <h3> Add new customer </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
