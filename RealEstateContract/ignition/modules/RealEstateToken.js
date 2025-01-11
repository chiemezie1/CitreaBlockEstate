// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const RealEstateTokenModule = buildModule("RealEstateTokenModule", (m) => {
  const defaultAdmin = m.getParameter("defaultAdmin");

  // Deploy RealEstateToken
  const realEstateToken = m.contract("RealEstateToken", [defaultAdmin]);

  return { realEstateToken };
});

module.exports = RealEstateTokenModule;

