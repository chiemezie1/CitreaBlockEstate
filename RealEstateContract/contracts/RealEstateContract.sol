// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RealEstateToken is ERC721Enumerable, AccessControl {
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    uint256 private _nextTokenId;
    uint256 private _nextReviewId;
    uint256 public commissionRate = 250; // 2.5% commission, in basis points

    struct Property {
        string name;
        address owner;
        string location;
        string description;
        string imageUrl;
        uint256 price;
        uint8 status; // 0: none, 1: forSale, 2: forRent
        bool isVerified;
        uint256[] reviewIds;
        uint256 likeCount;
        address currentTenant;
        uint256 rentalEndDate;
    }

    struct Review {
        uint256 id;
        uint256 propertyId;
        address reviewer;
        string content;
        uint8 rating;
    }

    mapping(uint256 => Property) private _properties;
    mapping(uint256 => Review) private _reviews;
    mapping(address => uint256) public userBalance;
    mapping(uint256 => mapping(address => bool)) private _propertyLikes;

    event PropertyMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string location
    );
    event PropertyVerified(uint256 indexed tokenId, bool verified);
    event PropertyUpdated(
        uint256 indexed tokenId,
        uint8 status,
        uint256 price,
        uint256 rentalEndDate
    );
    event PropertySold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price
    );
    event PropertyRented(
        uint256 indexed tokenId,
        address indexed tenant,
        uint256 rentPrice,
        uint256 duration
    );
    event RentalEnded(uint256 indexed tokenId, address indexed tenant);
    event CommissionRateChanged(uint256 newRate);
    event Withdrawal(address indexed user, uint256 amount);
    event ReviewAdded(
        uint256 indexed reviewId,
        uint256 indexed propertyId,
        address indexed reviewer
    );
    event PropertyLiked(
        uint256 indexed tokenId,
        address indexed liker,
        bool liked
    );
    event RoleAssigned(
        bytes32 indexed role,
        address indexed account,
        address indexed assigner
    );

    constructor(address defaultAdmin) ERC721("RealEstateToken", "RET") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ADMIN_ROLE, defaultAdmin);
        _grantRole(VERIFIER_ROLE, defaultAdmin);
    }

    function assignRole(bytes32 role, address account)
        external
        onlyRole(ADMIN_ROLE)
    {
        grantRole(role, account);
        emit RoleAssigned(role, account, msg.sender);
    }

    function mintProperty(
        string calldata _name,
        string calldata _location,
        string calldata _description,
        string calldata _imageUrl
    ) external {
        uint256 tokenId = _nextTokenId++;
        _properties[tokenId] = Property({
            name: _name,
            owner: msg.sender,
            location: _location,
            description: _description,
            imageUrl: _imageUrl,
            price: 0,
            status: 0,
            isVerified: false,
            reviewIds: new uint256[](0),
            likeCount: 0,
            currentTenant: address(0),
            rentalEndDate: 0
        });
        _safeMint(msg.sender, tokenId);
        emit PropertyMinted(tokenId, msg.sender, _name, _location);
    }

    function verifyProperty(uint256 _tokenId, bool _verified)
        external
        onlyRole(VERIFIER_ROLE)
    {
        require(_exists(_tokenId), "Property does not exist");
        _properties[_tokenId].isVerified = _verified;
        emit PropertyVerified(_tokenId, _verified);
    }

    function updatePropertyStatus(
        uint256 _tokenId,
        uint8 _status,
        uint256 _price,
        uint256 _rentalEndDate
    ) external {
        require(_ownerOf(_tokenId) == msg.sender, "Not the owner");
        Property storage property = _properties[_tokenId];
        require(property.isVerified, "Property not verified");
        require(_status <= 2, "Invalid status");

        property.status = _status;
        property.price = _price;
        property.rentalEndDate = _status == 2 ? _rentalEndDate : 0;

        emit PropertyUpdated(_tokenId, _status, _price, property.rentalEndDate);
    }

    function updatePropertyDetails(
        uint256 _tokenId,
        string calldata _name,
        string calldata _description,
        string calldata _imageUrl,
        string calldata _location
    ) external {
        require(_ownerOf(_tokenId) == msg.sender, "Not the owner");
        Property storage property = _properties[_tokenId];

        if (bytes(_name).length > 0) property.name = _name;
        if (bytes(_description).length > 0) property.description = _description;
        if (bytes(_imageUrl).length > 0) property.imageUrl = _imageUrl;
        if (bytes(_location).length > 0) property.location = _location;

        emit PropertyUpdated(
            _tokenId,
            property.status,
            property.price,
            property.rentalEndDate
        );
    }

    function buyProperty(uint256 _tokenId) external payable {
        Property storage property = _properties[_tokenId];
        require(
            property.status == 1 && property.isVerified,
            "Not for sale or not verified"
        );
        require(
            msg.value >= property.price && property.owner != msg.sender,
            "Insufficient funds or self-purchase"
        );

        address seller = property.owner;
        uint256 commission = (property.price * commissionRate) / 10000;
        uint256 sellerAmount = property.price - commission;
        userBalance[seller] += sellerAmount;
        userBalance[address(this)] += commission;
        property.owner = msg.sender;
        property.status = 0;
        _transfer(seller, msg.sender, _tokenId);
        uint256 excess = msg.value - property.price;
        if (excess > 0) payable(msg.sender).transfer(excess);

        emit PropertySold(_tokenId, seller, msg.sender, property.price);
    }

    function rentProperty(uint256 _tokenId) external payable {
        Property storage property = _properties[_tokenId];
        require(
            property.status == 2 && property.isVerified,
            "Not for rent or not verified"
        );
        require(
            property.currentTenant == address(0) &&
                msg.value >= property.price &&
                property.owner != msg.sender,
            "Invalid rental conditions"
        );
        require(
            block.timestamp < property.rentalEndDate,
            "Rental period has ended"
        );

        address landlord = property.owner;
        uint256 commission = (property.price * commissionRate) / 10000;
        uint256 landlordAmount = property.price - commission;
        userBalance[landlord] += landlordAmount;
        userBalance[address(this)] += commission;

        property.currentTenant = msg.sender;
        uint256 excess = msg.value - property.price;
        if (excess > 0) payable(msg.sender).transfer(excess);

        emit PropertyRented(
            _tokenId,
            msg.sender,
            property.price,
            property.rentalEndDate - block.timestamp
        );
    }

    function endRental(uint256 _tokenId) external {
        Property storage property = _properties[_tokenId];
        require(
            msg.sender == property.owner ||
                msg.sender == property.currentTenant,
            "Not authorized"
        );
        require(
            property.currentTenant != address(0) &&
                block.timestamp >= property.rentalEndDate,
            "Invalid rental state"
        );

        address tenant = property.currentTenant;
        property.currentTenant = address(0);
        property.rentalEndDate = 0;
        property.status = 0;

        emit RentalEnded(_tokenId, tenant);
    }

    function toggleLike(uint256 _tokenId) external {
        require(_exists(_tokenId), "Property does not exist");
        bool liked = _propertyLikes[_tokenId][msg.sender];
        _propertyLikes[_tokenId][msg.sender] = !liked;
        if (liked) {
            _properties[_tokenId].likeCount--;
        } else {
            _properties[_tokenId].likeCount++;
        }
        emit PropertyLiked(_tokenId, msg.sender, !liked);
    }

    function withdraw() external {
        uint256 amount = userBalance[msg.sender];
        require(amount > 0, "No balance to withdraw");
        userBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function setCommissionRate(uint256 _newRate) external onlyRole(ADMIN_ROLE) {
        require(_newRate <= 1000, "Commission rate must be <= 10%");
        commissionRate = _newRate;
        emit CommissionRateChanged(_newRate);
    }

    function addReview(
        uint256 _tokenId,
        string calldata _content,
        uint8 _rating
    ) external {
        require(_exists(_tokenId), "Property does not exist");
        require(
            _properties[_tokenId].owner != msg.sender,
            "Cannot review your own property"
        );
        require(_rating >= 1 && _rating <= 5, "Invalid rating");

        uint256 reviewId = _nextReviewId++;
        _reviews[reviewId] = Review({
            id: reviewId,
            propertyId: _tokenId,
            reviewer: msg.sender,
            content: _content,
            rating: _rating
        });

        _properties[_tokenId].reviewIds.push(reviewId);
        emit ReviewAdded(reviewId, _tokenId, msg.sender);
    }

    function getAllProperties(uint256 _offset, uint256 _limit)
        external
        view
        returns (uint256[] memory)
    {
        uint256 totalSupply = totalSupply();
        if (_offset >= totalSupply) return new uint256[](0);
        uint256 end = _offset + _limit > totalSupply
            ? totalSupply
            : _offset + _limit;
        uint256[] memory result = new uint256[](end - _offset);
        for (uint256 i = _offset; i < end; i++) {
            result[i - _offset] = tokenByIndex(i);
        }
        return result;
    }

    function getPropertyInfo(uint256 _tokenId)
        external
        view
        returns (
            string memory name,
            string memory location,
            string memory description,
            string memory imageUrl,
            uint256 price,
            uint8 status,
            bool isVerified,
            uint256 likeCount,
            address currentTenant,
            uint256 rentalEndDate,
            address owner
        )
    {
        require(_exists(_tokenId), "Property does not exist");
        Property storage property = _properties[_tokenId];
        return (
            property.name,
            property.location,
            property.description,
            property.imageUrl,
            property.price,
            property.status,
            property.isVerified,
            property.likeCount,
            property.currentTenant,
            property.rentalEndDate,
            property.owner
        );
    }

    function getPropertyReviewIds(uint256 _tokenId)
        external
        view
        returns (uint256[] memory)
    {
        require(_exists(_tokenId), "Property does not exist");
        return _properties[_tokenId].reviewIds;
    }

    function getReviewDetails(uint256 reviewId)
        external
        view
        returns (
            uint256 id,
            uint256 propertyId,
            address reviewer,
            string memory content,
            uint8 rating
        )
    {
        require(reviewId < _nextReviewId, "Review does not exist");
        Review storage review = _reviews[reviewId];
        return (
            review.id,
            review.propertyId,
            review.reviewer,
            review.content,
            review.rating
        );
    }

    function getPropertiesForAddress(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(_owner);
        uint256[] memory result = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            result[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return result;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
