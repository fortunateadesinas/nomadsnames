import { useState, useRef } from "react";
import { ethers } from "ethers";

const Search = ({ nomadNames, provider }) => {
  const [domainName, setDomainName] = useState("");
  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false);

  const buyDomain = async () => {
    if (!domainName) return alert("Please enter a domain name");

    // Prevent multiple clicks during processing
    if (isProcessing.current) return;

    // Validate domain ends with .bnb
    if (!domainName.endsWith(".bnb")) {
      alert("Domain must end with .bnb");
      return;
    }

    // Check if domain already exists
    const exists = await nomadNames.domainExistsByName(domainName);
    if (exists) {
      alert(`Domain "${domainName}" is already listed.`);
      return;
    }

    isProcessing.current = true;
    setLoading(true);
    try {
      const signer = provider.getSigner();

      const randomCost = ethers.utils.parseUnits(
        (Math.random() * 0.001).toFixed(5),
        "ether"
      );

      // List the domain
      const listTx = await nomadNames
        .connect(signer)
        .list(domainName, randomCost);
      await listTx.wait();

      alert(`Domain "${domainName}" has been listed successfully!`);
    } catch (error) {
      console.error("Error buying domain:", error);
      alert(
        "An error occurred while buying the domain. Please check the list if domain is not already minted"
      );
    }
    setLoading(false);
  };

  return (
    <header>
      <p className="header__subtitle">
        Find and purchase available domain names. Before any one else!!
      </p>
      <h2 className="header__title">It all starts with a domain name.</h2>
      <div className="header__search">
        <input
          type="text"
          className="header__input"
          placeholder="Enter domain (e.g., binance.bnb)"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
        <button
          type="button"
          className="header__button"
          onClick={buyDomain}
          disabled={loading}
        >
          {loading ? "Processing..." : "List For Sale"}
        </button>
      </div>
    </header>
  );
};

export default Search;
