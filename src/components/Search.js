import { useState } from "react";
import { ethers } from "ethers";

const Search = ({ nomadNames, provider }) => {
  const [domainName, setDomainName] = useState("");
  const [loading, setLoading] = useState(false);

  const buyDomain = async () => {
    if (!domainName) return alert("Please enter a domain name");
  
    setLoading(true);
    try {
      const signer = provider.getSigner();
      const domainId = ethers.utils.id(domainName); // Generate a unique ID for the domain
  
      // Check if domain exists
      let domain;
      try {
        domain = await nomadNames.getDomain(domainId);
      } catch (error) {
        domain = null;
      }
  
      if (domain) {
        if (domain.isOwned) {
          alert(`Domain "${domainName}" is already owned.`);
          setLoading(false);
          return;
        }
  
        if (domain.cost.gt(0)) {
          // Domain exists but is not owned → Mint it
          const tx = await nomadNames.connect(signer).mint(domainId, { value: domain.cost });
          await tx.wait();
          alert(`Domain "${domainName}" minted successfully!`);
          setLoading(false);
          return;
        }
      }
  
      // If domain doesn't exist, list it and then mint
      const randomCost = ethers.utils.parseUnits((Math.random() * 0.001).toFixed(5), "ether");
  
      // List the domain
      const listTx = await nomadNames.connect(signer).list(domainName, randomCost);
      await listTx.wait();
  
      // Mint the newly listed domain
      const mintTx = await nomadNames.connect(signer).mint(domainId, { value: randomCost });
      await mintTx.wait();
  
      alert(`Domain "${domainName}" has been listed and minted successfully!`);
    } catch (error) {
      console.error("Error buying domain:", error);
      alert("An error occurred while buying the domain. Please check the list if domain is not already minted");
    }
    setLoading(false);
  };
  

  return (
    <header>
      <p className="header__subtitle">Find and purchase available domain names.</p>
      <h2 className="header__title">It all starts with a domain name.</h2>
      <div className="header__search">
        <input
          type="text"
          className="header__input"
          placeholder="Find your domain"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
        <button type="button" className="header__button" onClick={buyDomain} disabled={loading}>
          {loading ? "Processing..." : "Buy It"}
        </button>
      </div>
    </header>
  );
};

export default Search;
