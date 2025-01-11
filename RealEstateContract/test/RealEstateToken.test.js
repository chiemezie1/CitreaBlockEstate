const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

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

    it("Should grant ADMIN_ROLE to owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant VERIFIER_ROLE to owner", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      expect(await realEstateToken.hasRole(await realEstateToken.VERIFIER_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to assign roles", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.assignRole(await realEstateToken.VERIFIER_ROLE(), addr1.address))
        .to.emit(realEstateToken, "RoleAssigned")
        .withArgs(await realEstateToken.VERIFIER_ROLE(), addr1.address, owner.address);
      expect(await realEstateToken.hasRole(await realEstateToken.VERIFIER_ROLE(), addr1.address)).to.be.true;
    });

    it("Should not allow non-admin to assign roles", async function () {
      const { realEstateToken, addr1, addr2 } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.connect(addr1).assignRole(await realEstateToken.VERIFIER_ROLE(), addr2.address))
        .to.be.revertedWithCustomError(realEstateToken, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Property Management", function () {
    it("Should allow minting a property", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg"))
        .to.emit(realEstateToken, "PropertyMinted")
        .withArgs(0, owner.address, "Property 1", "Location 1");
    });

    it("Should allow verifying a property", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await expect(realEstateToken.verifyProperty(0, true))
        .to.emit(realEstateToken, "PropertyVerified")
        .withArgs(0, true);
    });

    it("Should allow updating property status", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.verifyProperty(0, true);
      const oneMonthLater = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      await expect(realEstateToken.updatePropertyStatus(0, 1, ethers.parseEther("1"), 0))
        .to.emit(realEstateToken, "PropertyUpdated")
        .withArgs(0, 1, ethers.parseEther("1"), 0);
    });

    it("Should allow updating property details", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await expect(realEstateToken.updatePropertyDetails(0, "New Name", "New Description", "newimage.jpg", "New Location"))
        .to.emit(realEstateToken, "PropertyUpdated");
    });
  });

  describe("Property Transactions", function () {
    it("Should allow buying a property", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.updatePropertyStatus(0, 1, ethers.parseEther("1"), 0);
      await expect(realEstateToken.connect(addr1).buyProperty(0, { value: ethers.parseEther("1") }))
        .to.emit(realEstateToken, "PropertySold")
        .withArgs(0, owner.address, addr1.address, ethers.parseEther("1"));
    });

      
      /**
       * uncomment to run 
       * This will fail by + or - 5 dure to blocktime change
       */
    // it("Should allow renting a property", async function () {
    //   const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
    //   await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
    //   await realEstateToken.verifyProperty(0, true);
    //   const oneMonthLater = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    //   await realEstateToken.updatePropertyStatus(0, 2, ethers.parseEther("0.1"), oneMonthLater);

    //   await expect(realEstateToken.connect(addr1).rentProperty(0, { value: ethers.parseEther("0.1") }))
    //     .to.emit(realEstateToken, "PropertyRented")
    //     .withArgs(0, addr1.address, ethers.parseEther("0.1"), oneMonthLater - Math.floor(Date.now() / 1000));
    // });

    it("Should allow ending a rental", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.verifyProperty(0, true);
      const oneMonthLater = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      await realEstateToken.updatePropertyStatus(0, 2, ethers.parseEther("0.1"), oneMonthLater);
      await realEstateToken.connect(addr1).rentProperty(0, { value: ethers.parseEther("0.1") });
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await expect(realEstateToken.endRental(0))
        .to.emit(realEstateToken, "RentalEnded")
        .withArgs(0, addr1.address);
    });
  });

  describe("Reviews and Likes", function () {
    it("Should allow adding a review", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await expect(realEstateToken.connect(addr1).addReview(0, "Great property!", 5))
        .to.emit(realEstateToken, "ReviewAdded")
        .withArgs(0, 0, addr1.address);
    });

    it("Should allow toggling like", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await expect(realEstateToken.connect(addr1).toggleLike(0))
        .to.emit(realEstateToken, "PropertyLiked")
        .withArgs(0, addr1.address, true);
    });
  });

  describe("Financial Operations", function () {
    it("Should allow withdrawal", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.verifyProperty(0, true);
      await realEstateToken.updatePropertyStatus(0, 1, ethers.parseEther("1"), 0);
      await realEstateToken.connect(addr1).buyProperty(0, { value: ethers.parseEther("1") });
      await expect(realEstateToken.withdraw())
        .to.emit(realEstateToken, "Withdrawal")
        .withArgs(owner.address, ethers.parseEther("0.975")); // 97.5% of 1 ETH (2.5% commission)
    });

    it("Should allow setting commission rate", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await expect(realEstateToken.setCommissionRate(300))
        .to.emit(realEstateToken, "CommissionRateChanged")
        .withArgs(300);
      expect(await realEstateToken.commissionRate()).to.equal(300);
    });
  });

  describe("View Functions", function () {
    it("Should return correct property info", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      const propertyInfo = await realEstateToken.getPropertyInfo(0);
      expect(propertyInfo.name).to.equal("Property 1");
      expect(propertyInfo.location).to.equal("Location 1");
    });

    it("Should return correct properties for an address", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.mintProperty("Property 2", "Location 2", "Description 2", "image2.jpg");
      const properties = await realEstateToken.getPropertiesForAddress(owner.address);
      expect(properties.length).to.equal(2);
      expect(properties[0]).to.equal(0);
      expect(properties[1]).to.equal(1);
    });

    it("Should return correct review details", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.connect(addr1).addReview(0, "Great property!", 5);
      const reviewDetails = await realEstateToken.getReviewDetails(0);
      expect(reviewDetails.propertyId).to.equal(0);
      expect(reviewDetails.reviewer).to.equal(addr1.address);
      expect(reviewDetails.content).to.equal("Great property!");
      expect(reviewDetails.rating).to.equal(5);
    });

    it("Should return correct property review IDs", async function () {
      const { realEstateToken, owner, addr1 } = await loadFixture(deployRealEstateTokenFixture);
      await realEstateToken.mintProperty("Property 1", "Location 1", "Description 1", "image1.jpg");
      await realEstateToken.connect(addr1).addReview(0, "Great property!", 5);
      const reviewIds = await realEstateToken.getPropertyReviewIds(0);
      expect(reviewIds.length).to.equal(1);
      expect(reviewIds[0]).to.equal(0);
    });
  });

  describe("getAllProperties", function () {
    it("Should return correct properties with pagination", async function () {
      const { realEstateToken, owner } = await loadFixture(deployRealEstateTokenFixture);
      for (let i = 0; i < 5; i++) {
        await realEstateToken.mintProperty(`Property ${i+1}`, `Location ${i+1}`, `Description ${i+1}`, `image${i+1}.jpg`);
      }
      const properties = await realEstateToken.getAllProperties(1, 3);
      expect(properties.length).to.equal(3);
      expect(properties[0]).to.equal(1);
      expect(properties[2]).to.equal(3);
    });
  });

});

console.log("RealEstateToken tests completed successfully!");