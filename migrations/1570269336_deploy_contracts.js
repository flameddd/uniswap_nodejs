const OceanToken = artifacts.require("./OceanToken.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(OceanToken);
};
