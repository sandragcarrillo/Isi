import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("IsiModule", (m) => {
    const isi = m.contract("Isi");

    return { isi };
});