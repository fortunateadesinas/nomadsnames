import { useEffect, useState } from "react";
import { ethers } from "ethers";
// Components
import Search from "./components/Search";
import Domain from "./components/Domain";
import Navigation from "./components/Navigation";

// ABIs
import NomadNames from './abi/NomadNames.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [nomadNames, setNomadNames] = useState(null);
  const [domains, setDomains] = useState([]);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const nomadNames = new ethers.Contract(
      config[network.chainId].NomadNames.address,
      NomadNames,
      provider
    );
    setNomadNames(nomadNames);

    const maxSupply = await nomadNames.maxSupply();
    const domains = [];

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await nomadNames.getDomain(i);
      domains.push(domain);
    }

    setDomains(domains);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);
  
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search nomadNames={nomadNames} provider={provider} />
      <div className="cards__section">
        <h2 className="cards__title">
          Questioning the necessity of owning a domain name.
        </h2>
        <p className="cards__description">
          Own a unique username, use it across platforms, and store your avatar
          and profile details.
        </p>
        <hr />{" "}
        <div className="cards">
          {domains.map((domain, index) => (
            <Domain
              domain={domain}
              nomadNames={nomadNames}
              provider={provider}
              id={index + 1}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
