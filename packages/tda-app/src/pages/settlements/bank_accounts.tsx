import React from "react";

const BankAccounts: React.FC = () => {
  return (
    <div>
      <h1 style={styles.title}>Bank Accounts Page</h1>
    </div>
  );
};

const styles = {
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#eae8e8",
  },
};

export default BankAccounts;
