import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

const Domain = ({ domain, nomadNames, provider, id }) => {
  const [owner, setOwner] = useState(null);
  const [hasSold, setHasSold] = useState(false);

  const getOwner = useCallback(async () => {
    if (domain.isOwned || hasSold) {
      const owner = await nomadNames.ownerOf(id);
      setOwner(owner);
    }
  }, [domain.isOwned, hasSold, nomadNames, id]);

  const buyHandler = async () => {
    const signer = await provider.getSigner();
    const transaction = await nomadNames
      .connect(signer)
      .mint(id, { value: domain.cost });
    await transaction.wait();

    setHasSold(true);
  };

  useEffect(() => {
    getOwner();
  }, [hasSold, getOwner]);

  return (
    <div className="card">
      <div className="card__info">
        <h3>
          {domain.isOwned || owner ? <del>{domain.name}</del> : <>{domain.name}</>}
        </h3>
        <p>
          {domain.isOwned || owner ? (
            <></>
          ) : (
            <strong>{ethers.utils.formatUnits(domain.cost.toString(), "ether")} BNB</strong>
          )}
        </p>
      </div>
      {!domain.isOwned && !owner ? (
        <button type="button" className="card__button" onClick={() => buyHandler()}>
          Buy It
        </button>
      ) : (
        <p>
          <small>
            Owned by:
            <br />
            <span style={{ fontSize: "0.8rem", fontWeight: "900", marginRight: "10px" }}>
              {owner && owner.slice(0, 6) + "..." + owner.slice(38, 42)}
            </span>
          </small>
        </p>
      )}
    </div>
  );
};

export default Domain;