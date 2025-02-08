import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ServiceBought,
  ServiceCreated,
  ServiceDelivered,
  ServiceRefunded
} from "../generated/Isi/Isi"

export function createServiceBoughtEvent(
  serviceId: BigInt,
  buyer: Address,
  amount: BigInt
): ServiceBought {
  let serviceBoughtEvent = changetype<ServiceBought>(newMockEvent())

  serviceBoughtEvent.parameters = new Array()

  serviceBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "serviceId",
      ethereum.Value.fromUnsignedBigInt(serviceId)
    )
  )
  serviceBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  serviceBoughtEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return serviceBoughtEvent
}

export function createServiceCreatedEvent(
  serviceId: BigInt,
  name: string,
  price: BigInt,
  merchant: Address
): ServiceCreated {
  let serviceCreatedEvent = changetype<ServiceCreated>(newMockEvent())

  serviceCreatedEvent.parameters = new Array()

  serviceCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "serviceId",
      ethereum.Value.fromUnsignedBigInt(serviceId)
    )
  )
  serviceCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  serviceCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  serviceCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  )

  return serviceCreatedEvent
}

export function createServiceDeliveredEvent(
  serviceId: BigInt,
  buyer: Address,
  amount: BigInt
): ServiceDelivered {
  let serviceDeliveredEvent = changetype<ServiceDelivered>(newMockEvent())

  serviceDeliveredEvent.parameters = new Array()

  serviceDeliveredEvent.parameters.push(
    new ethereum.EventParam(
      "serviceId",
      ethereum.Value.fromUnsignedBigInt(serviceId)
    )
  )
  serviceDeliveredEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  serviceDeliveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return serviceDeliveredEvent
}

export function createServiceRefundedEvent(
  serviceId: BigInt,
  buyer: Address,
  amount: BigInt
): ServiceRefunded {
  let serviceRefundedEvent = changetype<ServiceRefunded>(newMockEvent())

  serviceRefundedEvent.parameters = new Array()

  serviceRefundedEvent.parameters.push(
    new ethereum.EventParam(
      "serviceId",
      ethereum.Value.fromUnsignedBigInt(serviceId)
    )
  )
  serviceRefundedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  serviceRefundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return serviceRefundedEvent
}
