const Cell = ({ value, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: 50,
        height: 50,
        border: "1px solid #333",
        background:
          value === "P1" ? "red" : value === "P2" ? "yellow" : "white",
        cursor: "pointer"
      }}
    />
  );
};

export default Cell;
