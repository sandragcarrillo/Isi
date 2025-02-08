import {
  ServiceBought as ServiceBoughtEvent,
  ServiceCreated as ServiceCreatedEvent,
  ServiceDelivered as ServiceDeliveredEvent,
  ServiceRefunded as ServiceRefundedEvent
} from "../generated/Isi/Isi"
import {
  ServiceBought,
  ServiceCreated,
  ServiceDelivered,
  ServiceRefunded
} from "../generated/schema"

export function handleServiceBought(event: ServiceBoughtEvent): void {
  let entity = new ServiceBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.serviceId = event.params.serviceId
  entity.buyer = event.params.buyer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleServiceCreated(event: ServiceCreatedEvent): void {
  let entity = new ServiceCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.serviceId = event.params.serviceId
  entity.name = event.params.name
  entity.price = event.params.price
  entity.merchant = event.params.merchant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleServiceDelivered(event: ServiceDeliveredEvent): void {
  let entity = new ServiceDelivered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.serviceId = event.params.serviceId
  entity.buyer = event.params.buyer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleServiceRefunded(event: ServiceRefundedEvent): void {
  let entity = new ServiceRefunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.serviceId = event.params.serviceId
  entity.buyer = event.params.buyer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
