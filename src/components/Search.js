import { useState, useRef } from "react";
import { ethers } from "ethers";
// import "./Search.css"; // You'll need to create this CSS file

const Search = ({ nomadNames, provider }) => {
  const [domainName, setDomainName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const isProcessing = useRef(false);

  const handleSubmit = async () => {
    if (!domainName) return alert("Please enter a domain name");
    if (!price) return alert("Please enter a price");

    if (isProcessing.current) return;

    if (!domainName.endsWith(".bnb")) {
      alert("Domain must end with .bnb");
      return;
    }

    const exists = await nomadNames.domainExistsByName(domainName);
    if (exists) {
      alert(`Domain "${domainName}" is already listed.`);
      return;
    }

    isProcessing.current = true;
    setLoading(true);
    setIsModalOpen(false);

    try {
      const signer = provider.getSigner();
      const cost = ethers.utils.parseUnits(price, "ether");

      const listTx = await nomadNames.connect(signer).list(domainName, cost);
      await listTx.wait();

      alert(`Domain "${domainName}" has been listed successfully!`);
      setPrice("");
    } catch (error) {
      console.error("Error buying domain:", error);
      alert(
        "An error occurred while buying the domain. Please check the list if domain is not already minted"
      );
    }
    setLoading(false);
    isProcessing.current = false;
  };

  return (
    <header>
      <p className="header__subtitle">
        Find, list or purchase available domain names.
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
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          {loading ? "Processing..." : "List For Sale"}
        </button>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>List Domain for Sale</h2>
              <p>Set the listing price for {domainName || "your domain"}</p>
              <div className="modal-form">
                <label htmlFor="price">Price (BNB):</label>
                <input
                  id="price"
                  type="number"
                  step="0.0001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.001"
                />
              </div>
              <div className="modal-buttons">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="modal-button confirm"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="modal-button cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Search;