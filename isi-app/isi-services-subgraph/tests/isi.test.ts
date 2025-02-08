import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ServiceBought } from "../generated/schema"
import { ServiceBought as ServiceBoughtEvent } from "../generated/Isi/Isi"
import { handleServiceBought } from "../src/isi"
import { createServiceBoughtEvent } from "./isi-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let serviceId = BigInt.fromI32(234)
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let amount = BigInt.fromI32(234)
    let newServiceBoughtEvent = createServiceBoughtEvent(
      serviceId,
      buyer,
      amount
    )
    handleServiceBought(newServiceBoughtEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ServiceBought created and stored", () => {
    assert.entityCount("ServiceBought", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ServiceBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "serviceId",
      "234"
    )
    assert.fieldEquals(
      "ServiceBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ServiceBought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
