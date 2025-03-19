const hre = require("hardhat");
const { ethers } = require("hardhat"); // Explicitly import ethers

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners();
    const NAME = "NomadNames";
    const SYMBOL = "NOMADN";

    // Deploy contract
    const NomadNames = await ethers.getContractFactory("NomadNames");
    const nomadNames = await NomadNames.deploy(NAME, SYMBOL);
    await nomadNames.deployed();

    console.log(`Deployed Domain Contract at: ${nomadNames.address}\n`);

    // List of 5 domains
    const names = [
        "alpha.bnb",
        "beta.bnb",
        "gamma.bnb",
        "delta.bnb",
        "epsilon.bnb",
    ];

    // Random cost generator in the range of 0.001 to 0.01 BNB
    const costs = names.map(() =>
        tokens((Math.random() * (0.01 - 0.001) + 0.001).toFixed(5))
    );

    // List domains
    for (let i = 0; i < names.length; i++) {
        const transaction = await nomadNames.connect(deployer).list(names[i], costs[i]);
        await transaction.wait();

        console.log(`Listed Domain ${i + 1}: ${names[i]} with cost ${ethers.utils.formatEther(costs[i])} BNB`);
    }

    console.log("\nDeployment and listing completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });