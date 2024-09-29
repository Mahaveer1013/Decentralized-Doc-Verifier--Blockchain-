const DocumentStorage = artifacts.require("DocumentStorage");

module.exports = function(deployer) {
  deployer.deploy(DocumentStorage);
};
