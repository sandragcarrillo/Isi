// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract Isi {
    struct Service {
        string name;
        string description;
        uint256 price;
        address payable merchant;
        address buyer;
        bool isActive;
        bool isDelivered;
    }

    mapping(uint256 => Service) public services;
    mapping(uint256 => uint256) public escrows;

    uint256 public serviceCounter;
    address public owner;

    event ServiceCreated(uint256 serviceId, string name, uint256 price, address merchant);
    event ServiceBought(uint256 serviceId, address buyer, uint256 amount);
    event ServiceDelivered(uint256 serviceId, address buyer, uint256 amount);
    event ServiceRefunded(uint256 serviceId, address buyer, uint256 amount);

    modifier onlyBuyer(uint256 _serviceId) {
        require(services[_serviceId].buyer == msg.sender, "Only buyer can call this function.");
        _;
    }

    modifier serviceExists(uint256 _serviceId) {
        require(_serviceId > 0 && _serviceId <= serviceCounter, "Service does not exist.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }


    function createService(string memory _name, string memory _description, uint256 _price) external {
        require(_price > 0, "Price must be greater than 0.");

        serviceCounter++;
        services[serviceCounter] = Service({
            name: _name,
            description: _description,
            price: _price,
            merchant: payable(msg.sender),
            buyer: address(0),
            isActive: true,
            isDelivered: false
        });

        emit ServiceCreated(serviceCounter, _name, _price, msg.sender);
    }


    function buyService(uint256 _serviceId) external payable serviceExists(_serviceId) {
        Service storage service = services[_serviceId];
        require(service.isActive, "Service is not active.");
        require(msg.value == service.price, "Wrong amount.");
        require(service.buyer == address(0), "You already bought this service.");

        service.buyer = msg.sender;
        escrows[_serviceId] = msg.value;

        emit ServiceBought(_serviceId, msg.sender, msg.value);
    }


    function confirmDelivery(uint256 _serviceId) external serviceExists(_serviceId) onlyBuyer(_serviceId) {
        Service storage service = services[_serviceId];
        require(!service.isDelivered, "Service was already delivered.");

        uint256 escrowAmount = escrows[_serviceId];
        require(escrowAmount > 0, "No funds in the escrow.");

        escrows[_serviceId] = 0;
        service.isDelivered = true;

        (bool success, ) = service.merchant.call{value: escrowAmount}("");
        require(success, "Transfer failed.");

        emit ServiceDelivered(_serviceId, msg.sender, escrowAmount);
    }


    function refund(uint256 _serviceId) external serviceExists(_serviceId) onlyBuyer(_serviceId) {
        Service storage service = services[_serviceId];
        require(!service.isDelivered, "Service was already delivered.");

        uint256 escrowAmount = escrows[_serviceId];
        require(escrowAmount > 0, "No funds to refund.");

        escrows[_serviceId] = 0;
        service.buyer = address(0); 

        (bool success, ) = payable(msg.sender).call{value: escrowAmount}("");
        require(success, "Refund failed.");

        emit ServiceRefunded(_serviceId, msg.sender, escrowAmount);
    }
}
