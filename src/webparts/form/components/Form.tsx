import * as React from "react";
import styles from "./Form.module.scss";
import type { IFormProps } from "./IFormProps";
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";

type ListItem = {
  Id: number;
  Name: string;
  Address: string;
};

const Form: React.FC<IFormProps> = ({
  hasTeamsContext,
  siteUrl,
  spHttpClient,
}) => {
  const [items, setItems] = React.useState<ListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const url = `${siteUrl}/_api/web/lists/getByTitle('Customers')/items?$select=Id,Name,Address`;
      try {
        const res: SPHttpClientResponse = await spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
        );
        console.log("res", res);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const data = await res.json();
        if (isMounted) {
          setItems(data.value as ListItem[]);
        }
      } catch (error: any) {
        if (isMounted) {
          console.log(error);
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
        <h3>Edit customer data</h3>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <ul>
          {items.map((i) => (
            <li key={i.Id}>{i.Name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Form;
