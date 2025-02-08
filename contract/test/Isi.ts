import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Isi", function () {
    async function deployFixture() {
        const [owner, merchant, buyer] = await ethers.getSigners();
        const Isi = await ethers.getContractFactory("Isi");
        const isi = await Isi.deploy();
        await isi.waitForDeployment();

        return { isi, owner, merchant, buyer };
    }

    it("Should allow a merchant to create a service", async function () {
        const { isi, merchant } = await loadFixture(deployFixture);

        await isi.connect(merchant).createService(
            "Web Development",
            "Professional website creation",
            ethers.parseEther("1")
        );

        const service = await isi.services(1);
        expect(service.name).to.equal("Web Development");
        expect(service.merchant).to.equal(merchant.address);
    });

    it("Should allow a buyer to purchase a service", async function () {
        const { isi, merchant, buyer } = await loadFixture(deployFixture);

        const price = ethers.parseEther("1");
        await isi.connect(merchant).createService("SEO Optimization", "SEO services", price);

        await isi.connect(buyer).buyService(1, { value: price });

        const service = await isi.services(1);
        expect(service.buyer).to.equal(buyer.address);
    });

    it("Should allow the buyer to confirm delivery and release funds", async function () {
        const { isi, merchant, buyer } = await loadFixture(deployFixture);

        const price = ethers.parseEther("1");
        await isi.connect(merchant).createService("Marketing", "Social media ads", price);
        await isi.connect(buyer).buyService(1, { value: price });

        const merchantBalanceBefore = await ethers.provider.getBalance(merchant.address);
        await isi.connect(buyer).confirmDelivery(1);
        const merchantBalanceAfter = await ethers.provider.getBalance(merchant.address);

        expect(merchantBalanceAfter).to.be.gt(merchantBalanceBefore);
    });

    it("Should allow a buyer to request a refund", async function () {
        const { isi, merchant, buyer } = await loadFixture(deployFixture);

        const price = ethers.parseEther("1");
        await isi.connect(merchant).createService("Consulting", "Business consulting", price);
        await isi.connect(buyer).buyService(1, { value: price });

        const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
        await isi.connect(buyer).refund(1);
        const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

        expect(buyerBalanceAfter).to.be.gt(buyerBalanceBefore);
    });

    it("Should revert if someone else tries to confirm delivery", async function () {
        const { isi, merchant, buyer, owner } = await loadFixture(deployFixture);

        const price = ethers.parseEther("1");
        await isi.connect(merchant).createService("Photography", "Event photography", price);
        await isi.connect(buyer).buyService(1, { value: price });

        await expect(isi.connect(owner).confirmDelivery(1))
            .to.be.revertedWith("Only buyer can call this function.");
    });
});
