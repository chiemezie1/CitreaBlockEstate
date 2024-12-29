const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("RealEstateToken", function () {
  async function deployRealEstateTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
    const realEstateToken = await RealEstateToken.deploy(owner.address);

    return { realEstateToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant PAUSER_ROLE to owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.PAUSER_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant MINTER_ROLE to owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.MINTER_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant ADMIN_ROLE to owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.ADMIN_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow minting by admin", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg"))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "Minted", owner.address, ethers.parseEther("1"));
      expect(await realEstateToken.ownerOf(0)).to.equal(owner.address);
    });

    it("Should not allow minting by non-admin", async function () {
      const { realEstateToken, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(addr1).safeMint(addr1.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg"))
        .to.be.revertedWithCustomError(realEstateToken, "AccessControlUnauthorizedAccount")
        .withArgs(addr1.address, await realEstateToken.MINTER_ROLE());
    });
  });

  describe("Property Listing", function () {
    it("Should allow owner to list property for sale", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await expect(realEstateToken.setPropertyListing(0, ethers.parseEther("2"), true, 0, false))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "Listed", owner.address, ethers.parseEther("2"));
      const propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[3]).to.be.true; // forSale
      expect(propertyInfo[2]).to.equal(ethers.parseEther("2")); // price
    });

    it("Should not allow non-owner to list property", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await expect(realEstateToken.connect(addr1).setPropertyListing(0, ethers.parseEther("2"), true, 0, false))
        .to.be.revertedWith("Not the owner");
    });
  });

  describe("Reviews", function () {
    it("Should allow adding a review", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await expect(realEstateToken.connect(addr1).addReview(0, "Great property!", 5))
        .to.emit(realEstateToken, "ReviewAction")
        .withArgs(0, 0, "Added", addr1.address);
      const propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[8].length).to.equal(1); // reviewIds
    });

    it("Should not allow owner to review their own property", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await expect(realEstateToken.addReview(0, "Great property!", 5))
        .to.be.revertedWith("Cannot review own property");
    });

    it("Should allow deleting a review", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.connect(addr1).addReview(0, "Great property!", 5);
      await expect(realEstateToken.connect(addr1).deleteReview(0))
        .to.emit(realEstateToken, "ReviewAction")
        .withArgs(0, 0, "Deleted", addr1.address);
    });

    it("Should not allow deleting a review by non-owner or non-reviewer", async function () {
      const { realEstateToken, owner, addr1, addr2 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.connect(addr1).addReview(0, "Great property!", 5);
      await expect(realEstateToken.connect(addr2).deleteReview(0))
        .to.be.revertedWith("Not authorized");
    });
  });

  describe("Renting", function () {
    it("Should allow renting a property", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.setPropertyListing(0, 0, false, ethers.parseEther("0.01"), true);
      await realEstateToken.verifyProperty(0, true);
      await expect(realEstateToken.connect(addr1).rentProperty(0, 30, { value: ethers.parseEther("0.3") }))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "Rented", addr1.address, ethers.parseEther("0.3"));
      const propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[4]).to.be.true; // forRent
      expect(propertyInfo[5]).to.equal(ethers.parseEther("0.01")); // rentPrice
    });

    it("Should end rental", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.setPropertyListing(0, 0, false, ethers.parseEther("0.01"), true);
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.connect(addr1).rentProperty(0, 30, { value: ethers.parseEther("0.3") });
      
      await time.increase(31 * 24 * 60 * 60); // Increase time by 31 days
      
      await expect(realEstateToken.connect(addr1).endRental(0))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "RentalEnded", addr1.address, 0);
      const propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[4]).to.be.true; // forRent (should still be available for rent after ending)
    });

    it("Should not allow renting an unavailable property", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await expect(realEstateToken.connect(addr1).rentProperty(0, 30, { value: ethers.parseEther("0.3") }))
        .to.be.revertedWith("Property not available for rent");
    });

    it("Should not allow renting with insufficient funds", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.setPropertyListing(0, 0, false, ethers.parseEther("0.01"), true);
      await realEstateToken.verifyProperty(0, true);
      await expect(realEstateToken.connect(addr1).rentProperty(0, 30, { value: ethers.parseEther("0.2") }))
        .to.be.revertedWith("Insufficient funds");
    });
  });

  describe("View Functions", function () {
    it("Should return correct properties for sale", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.safeMint(owner.address, "Property 2", "Location 2", ethers.parseEther("2"), "Description 2", "image2.jpg");
      await realEstateToken.setPropertyListing(0, ethers.parseEther("1"), true, 0, false);
      await realEstateToken.setPropertyListing(1, ethers.parseEther("2"), true, 0, false);
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.verifyProperty(1, true);
      const propertiesForSale = await realEstateToken.getPropertiesForSale();
      expect(propertiesForSale.length).to.equal(2);
      expect(propertiesForSale[0]).to.equal(0);
      expect(propertiesForSale[1]).to.equal(1);
    });

    it("Should return correct properties for rent", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.safeMint(owner.address, "Property 2", "Location 2", ethers.parseEther("2"), "Description 2", "image2.jpg");
      await realEstateToken.setPropertyListing(0, 0, false, ethers.parseEther("0.01"), true);
      await realEstateToken.setPropertyListing(1, 0, false, ethers.parseEther("0.02"), true);
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.verifyProperty(1, true);
      const propertiesForRent = await realEstateToken.getPropertiesForRent();
      expect(propertiesForRent.length).to.equal(2);
      expect(propertiesForRent[0]).to.equal(0);
      expect(propertiesForRent[1]).to.equal(1);
    });

    it("Should return correct properties owned by an address", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.safeMint(addr1.address, "Property 2", "Location 2", ethers.parseEther("2"), "Description 2", "image2.jpg");
      const ownerProperties = await realEstateToken.getPropertiesOwnedBy(owner.address);
      expect(ownerProperties.length).to.equal(1);
      expect(ownerProperties[0]).to.equal(0);
      const addr1Properties = await realEstateToken.getPropertiesOwnedBy(addr1.address);
      expect(addr1Properties.length).to.equal(1);
      expect(addr1Properties[0]).to.equal(1);
    });
  });

  describe("Likes", function () {
    it("Should toggle like", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      
      await expect(realEstateToken.connect(addr1).toggleLike(0))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "LikeToggled", addr1.address, 0);
      let propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[7]).to.equal(1); // likes count

      await expect(realEstateToken.connect(addr1).toggleLike(0))
        .to.emit(realEstateToken, "PropertyAction")
        .withArgs(0, "LikeToggled", addr1.address, 0);
      propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo[7]).to.equal(0); // likes count
    });
  });

  describe("Minter Role", function () {
    it("Should request minter role", async function () {
      const { realEstateToken, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(addr1).requestMintRole("https://example.com/document"))
        .to.emit(realEstateToken, "MintRoleRequested")
        .withArgs(addr1.address, "https://example.com/document");
      const request = await realEstateToken.mintRequests(addr1.address);
      expect(request.requester).to.equal(addr1.address);
      expect(request.documentUrl).to.equal("https://example.com/document");
      expect(request.approved).to.be.false;
    });

    it("Should approve minter role", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.connect(addr1).requestMintRole("https://example.com/document");
      await expect(realEstateToken.connect(owner).approveMintRole(addr1.address, true))
        .to.emit(realEstateToken, "MintRoleApproved")
        .withArgs(addr1.address, true);
      expect(await realEstateToken.hasRole(await realEstateToken.MINTER_ROLE(), addr1.address)).to.be.true;
    });

    it("Should not allow non-admin to approve minter role", async function () {
      const { realEstateToken, addr1, addr2 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.connect(addr1).requestMintRole("https://example.com/document");
      await expect(realEstateToken.connect(addr2).approveMintRole(addr1.address, true))
        .to.be.revertedWithCustomError(realEstateToken, "AccessControlUnauthorizedAccount")
        .withArgs(addr2.address, await realEstateToken.ADMIN_ROLE());
    });
  });

  describe("Withdrawal", function () {
    it("Should withdraw balance", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.safeMint(owner.address, "Property 1", "Location 1", ethers.parseEther("1"), "Description 1", "image1.jpg");
      await realEstateToken.setPropertyListing(0, ethers.parseEther("1"), true, 0, false);
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.connect(addr1).buyProperty(0, { value: ethers.parseEther("1") });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await expect(realEstateToken.connect(owner).withdraw())
        .to.emit(realEstateToken, "Withdrawal")
        .withArgs(owner.address, ethers.parseEther("0.95")); // 95% of 1 ETH (5% commission)
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow withdrawal with no balance", async function () {
      const { realEstateToken, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(addr1).withdraw())
        .to.be.revertedWith("No balance");
    });
  });

  describe("Commission Rate", function () {
    it("Should allow admin to change commission rate", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(owner).setCommissionRate(10))
        .to.emit(realEstateToken, "CommissionRateChanged")
        .withArgs(10);
      expect(await realEstateToken.commissionRate()).to.equal(10);
    });

    it("Should not allow non-admin to change commission rate", async function () {
      const { realEstateToken, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(addr1).setCommissionRate(10))
        .to.be.revertedWithCustomError(realEstateToken, "AccessControlUnauthorizedAccount")
        .withArgs(addr1.address, await realEstateToken.ADMIN_ROLE());
    });

    it("Should not allow setting commission rate above 100", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(owner).setCommissionRate(101))
        .to.be.revertedWith("Commission rate must be between 0 and 100");
    });
  });
});

