const hre = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n, 'ether');
}

async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners()
    const NAME = "NomadNames"
    const SYMBOL = "NOMADN"
  
    // Deploy contract
    const NomadNames = await ethers.getContractFactory("NomadNames")
    const nomadNames = await NomadNames.deploy(NAME, SYMBOL)
    await nomadNames.deployed();
  
    console.log(`Deployed Domain Contract at: ${nomadNames.address}\n`)
  
    // List of 6 domains
    const names = [
        "alpha.bnb", "beta.bnb", "gamma.bnb", "delta.bnb", "epsilon.bnb"
    ];

    // Random cost generator in the range of 0.001 to 0.01 BNB
    const costs = names.map(() => tokens((Math.random() * (0.001 - 0.0001) + 0.0001).toFixed(5)));
  
    for (var i = 0; i < 5; i++) {
      const transaction = await nomadNames.connect(deployer).list(names[i], costs[i])
      await transaction.wait()
  
      console.log(`Listed Domain ${i + 1}: ${names[i]}`)
    }
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });