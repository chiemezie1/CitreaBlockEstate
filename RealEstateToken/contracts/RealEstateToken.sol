// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RealEstateToken is ERC721, ERC721Enumerable, ERC721Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 private _nextTokenId;
    uint256 private _nextReviewId;
    uint256 public commissionRate = 5; // 5% commission, mutable

    struct Property {
        string name;
        string location;
        string description;
        string imageUrl;
        uint256 price;
        uint256 rentPrice;
        bool forSale;
        bool forRent;
        bool isVerified;
        uint256 likeCount;
        mapping(address => bool) likes;
        address currentTenant;
        uint256 rentalEndDate;
        uint256[] reviewIds;
    }

    struct Review {
        uint256 id;
        uint256 propertyId;
        address reviewer;
        string content;
        uint8 rating;
        bool isDeleted;
    }

    struct MintRequest {
        address requester;
        string documentUrl;
        bool approved;
    }

    mapping(uint256 => Property) private properties;
    mapping(uint256 => Review) private reviews;
    mapping(address => uint256) public userBalance;
    mapping(address => MintRequest) public mintRequests;

    event PropertyAction(uint256 indexed tokenId, string action, address indexed actor, uint256 price);
    event ReviewAction(uint256 indexed reviewId, uint256 indexed propertyId, string action, address indexed actor);
    event Withdrawal(address indexed user, uint256 amount);
    event CommissionRateChanged(uint256 newRate);
    event MintRoleRequested(address indexed requester, string documentUrl);
    event MintRoleApproved(address indexed requester, bool approved);

    constructor(address defaultAdmin) ERC721("RealEstateToken", "RET") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(ADMIN_ROLE, defaultAdmin);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function requestMintRole(string memory _documentUrl) external {
        require(bytes(_documentUrl).length > 0, "Document URL is required");
        require(!hasRole(MINTER_ROLE, _msgSender()), "Already has MINTER_ROLE");
        require(mintRequests[_msgSender()].requester == address(0), "Request already submitted");

        mintRequests[_msgSender()] = MintRequest({
            requester: _msgSender(),
            documentUrl: _documentUrl,
            approved: false
        });

        emit MintRoleRequested(_msgSender(), _documentUrl);
    }

    function approveMintRole(address _requester, bool _approved) external onlyRole(ADMIN_ROLE) {
        require(mintRequests[_requester].requester != address(0), "No request found");
        
        if (_approved) {
            _grantRole(MINTER_ROLE, _requester);
        }
        
        mintRequests[_requester].approved = _approved;
        emit MintRoleApproved(_requester, _approved);
    }

    function safeMint(
        address to,
        string memory _name,
        string memory _location,
        uint256 _price,
        string memory _description,
        string memory _imageUrl
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        Property storage newProperty = properties[tokenId];
        newProperty.name = _name;
        newProperty.location = _location;
        newProperty.price = _price;
        newProperty.description = _description;
        newProperty.imageUrl = _imageUrl;

        _safeMint(to, tokenId);
        emit PropertyAction(tokenId, "Minted", to, _price);
    }

    function setPropertyListing(uint256 _tokenId, uint256 _price, bool _forSale, uint256 _rentPrice, bool _forRent) external {
        require(ownerOf(_tokenId) == _msgSender(), "Not the owner");
        require(_price > 0 || _rentPrice > 0, "Price must be greater than 0");

        Property storage property = properties[_tokenId];
        property.price = _price;
        property.forSale = _forSale;
        property.forRent = _forRent;
        property.rentPrice = _rentPrice;

        emit PropertyAction(_tokenId, _forSale || _forRent ? "Listed" : "Unlisted", _msgSender(), _price);
    }

    function verifyProperty(uint256 _tokenId, bool _verified) external onlyRole(ADMIN_ROLE) {
        properties[_tokenId].isVerified = _verified;
        emit PropertyAction(_tokenId, "Verified", _msgSender(), 0);
    }

    function buyProperty(uint256 _tokenId) external payable {
        Property storage property = properties[_tokenId];
        require(property.forSale && property.isVerified, "Property not available");
        require(msg.value >= property.price, "Insufficient funds");

        address seller = ownerOf(_tokenId);
        require(seller != _msgSender(), "Cannot buy your own property");

        uint256 commission = (property.price * commissionRate) / 100;
        uint256 sellerAmount = property.price - commission;

        userBalance[seller] += sellerAmount;
        userBalance[_msgSender()] += commission;

        property.forSale = false;
        property.forRent = false;

        _transfer(seller, _msgSender(), _tokenId);

        if (msg.value > property.price) {
            payable(_msgSender()).transfer(msg.value - property.price);
        }

        emit PropertyAction(_tokenId, "Sold", _msgSender(), property.price);
    }

    function rentProperty(uint256 _tokenId, uint256 _durationInDays) external payable {
        Property storage property = properties[_tokenId];
        require(property.forRent && property.isVerified, "Property not available for rent");
        require(property.currentTenant == address(0), "Property already rented");
        require(msg.value >= property.rentPrice * _durationInDays, "Insufficient funds");

        address landlord = ownerOf(_tokenId);
        require(landlord != _msgSender(), "Cannot rent your own property");

        uint256 totalRent = property.rentPrice * _durationInDays;
        uint256 commission = (totalRent * commissionRate) / 100;
        uint256 landlordAmount = totalRent - commission;

        userBalance[landlord] += landlordAmount;
        userBalance[_msgSender()] += commission;

        property.currentTenant = _msgSender();
        property.rentalEndDate = block.timestamp + (_durationInDays * 1 days);

        if (msg.value > totalRent) {
            payable(_msgSender()).transfer(msg.value - totalRent);
        }

        emit PropertyAction(_tokenId, "Rented", _msgSender(), totalRent);
    }

    function endRental(uint256 _tokenId) external {
        Property storage property = properties[_tokenId];
        require(_msgSender() == ownerOf(_tokenId) || _msgSender() == property.currentTenant, "Not authorized");
        require(block.timestamp >= property.rentalEndDate, "Rental period not over");

        property.currentTenant = address(0);
        property.rentalEndDate = 0;

        emit PropertyAction(_tokenId, "RentalEnded", _msgSender(), 0);
    }

    function toggleLike(uint256 _tokenId) external {
        Property storage property = properties[_tokenId];
        if (property.likes[_msgSender()]) {
            property.likeCount--;
            delete property.likes[_msgSender()];
        } else {
            property.likeCount++;
            property.likes[_msgSender()] = true;
        }
        emit PropertyAction(_tokenId, "LikeToggled", _msgSender(), 0);
    }

    function addReview(uint256 _tokenId, string memory _content, uint8 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Invalid rating");
        require(ownerOf(_tokenId) != _msgSender(), "Cannot review own property");

        uint256 reviewId = _nextReviewId++;

        Review storage newReview = reviews[reviewId];
        newReview.id = reviewId;
        newReview.propertyId = _tokenId;
        newReview.reviewer = _msgSender();
        newReview.content = _content;
        newReview.rating = _rating;

        properties[_tokenId].reviewIds.push(reviewId);

        emit ReviewAction(reviewId, _tokenId, "Added", _msgSender());
    }

    function deleteReview(uint256 _reviewId) external {
        Review storage review = reviews[_reviewId];
        require(review.reviewer == _msgSender() || ownerOf(review.propertyId) == _msgSender(), "Not authorized");
        require(!review.isDeleted, "Already deleted");

        review.isDeleted = true;
        emit ReviewAction(_reviewId, review.propertyId, "Deleted", _msgSender());
    }

    function withdraw() external {
        uint256 amount = userBalance[_msgSender()];
        require(amount > 0, "No balance");

        userBalance[_msgSender()] = 0;
        payable(_msgSender()).transfer(amount);

        emit Withdrawal(_msgSender(), amount);
    }

    function setCommissionRate(uint256 _newRate) external onlyRole(ADMIN_ROLE) {
        require(_newRate <= 100, "Commission rate must be between 0 and 100");
        commissionRate = _newRate;
        emit CommissionRateChanged(_newRate);
    }

    function getPropertyInfo(uint256 _tokenId) external view returns (
        string memory name,
        string memory location,
        uint256 price,
        bool forSale,
        bool forRent,
        uint256 rentPrice,
        bool isVerified,
        uint256 likes,
        uint256[] memory reviewIds
    ) {
        Property storage property = properties[_tokenId];
        return (
            property.name,
            property.location,
            property.price,
            property.forSale,
            property.forRent,
            property.rentPrice,
            property.isVerified,
            property.likeCount,
            property.reviewIds
        );
    }

    function getPropertiesOwnedBy(address _owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory result = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            result[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return result;
    }

    function getPropertiesForSale() external view returns (uint256[] memory) {
        return _getPropertiesByStatus(true, false);
    }

    function getPropertiesForRent() external view returns (uint256[] memory) {
        return _getPropertiesByStatus(false, true);
    }

    function _getPropertiesByStatus(bool forSale, bool forRent) private view returns (uint256[] memory) {
        uint256 totalSupply = totalSupply();
        uint256[] memory result = new uint256[](totalSupply);
        uint256 count = 0;

        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 tokenId = tokenByIndex(i);
            Property storage property = properties[tokenId];
            if (property.isVerified && ((forSale && property.forSale) || (forRent && property.forRent))) {
                result[count] = tokenId;
                count++;
            }
        }

        // Resize the array to the actual count
        assembly {
            mstore(result, count)
        }

        return result;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

