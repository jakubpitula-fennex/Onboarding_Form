import * as React from "react";

const CustomerCard: React.FC<{
  Id: number;
  Name: string;
  Address: string;
  NoRigs: number;
  NoJackups: number;
  NoModus: number;
  setOpenItems: React.Dispatch<React.SetStateAction<number[]>>;
  openItems: number[];
}> = ({
  Id,
  Name,
  Address,
  NoRigs,
  NoJackups,
  NoModus,
  setOpenItems,
  openItems,
}) => {
  const isOpen = openItems.indexOf(Id) !== -1;
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
        <div>
          {[
            { label: "Name", value: Name },
            { label: "Address", value: Address },
            { label: "Number of rigs", value: NoRigs },
            { label: "Number of jack ups", value: NoJackups },
            { label: "Number of MODUs", value: NoModus },
          ].map((field) => (
            <div
              key={field.label}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                padding: 10,
                gap: 20,
              }}
            >
              <div style={{ width: "25%", textAlign: "left" }}>
                <p style={{ fontWeight: "bold" }}>{field.label}</p>
              </div>
              <div style={{ width: "60%", textAlign: "left" }}>
                <p>{field.value}</p>
              </div>
              <div style={{ width: "15%", textAlign: "right" }}>
                <button style={{ backgroundColor: "blue", color: "white" }}>
                  Edit
                </button>
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
            <button style={{ backgroundColor: "green", color: "white" }}>
              Save
            </button>{" "}
            <button style={{ backgroundColor: "red", color: "white" }}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCard;
