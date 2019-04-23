pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

// token registry contract interface
contract Registry {
    function tokenCount() public view returns (uint);
    function token(uint _id) external view returns (
        address addr,
        string memory tla,
        uint base,
        string memory name,
        address owner
    );
    function fromAddress(address _addr) external view returns (
        uint id,
        string memory tla,
        uint base,
        string memory name,
        address owner
    );
    function fromTLA(string calldata _tla) external view returns (
        uint id,
        address addr,
        uint base,
        string memory name,
        address owner
    );
    function meta(uint _id, bytes32 _key) external view returns (
        bytes32
    );
}

/// @title A proxy contract for the Parity token registry
/// @author Michael Bauer
/// @notice Purpose of this contract is to enable batch retrieval of
/// token definitions
contract RegistryProxy {

    // struct as defined in TokenReg.sol
    struct Token {
        uint id;
        address addr;
        string tla;
        uint base;
        string name;
        address owner;
    }

    // The Parity token registry contract
    Registry internal registry;

    constructor(address _registry) public {
        // check if provided _registry is actually a contract
        uint256 registryCode;
        assembly {registryCode := extcodesize(_registry)}
        require(
            registryCode > 0,
            "Adress is not a contract."
        );
        // TODO: Check if required ABI is available?
        registry = Registry(_registry);
    }

    /**
      Get number of tokens registered
    */
    function tokenCount() public view returns (uint) {
        return registry.tokenCount();
    }

    /**
      @dev Get a single token by it's id. If the token ID is invalid this will revert.
      @param _id The ID of the token to get
      @return Token struct
    */
    function getToken(
        uint _id
    )
        external
        view
        returns (Token memory token)
    {
        ( address addr, string memory tla, uint base, string memory name, address owner ) = registry.token(_id);
        token.id = _id;
        token.addr = addr;
        token.tla = tla;
        token.base = base;
        token.name = name;
        token.owner = owner;
    }

    /**
      @dev Get a single token by it's contract address. Reverts if there is no token registered at provided address.
      @param _address The contract address of the token to get
      @return Token struct
    */
    function fromAddress(
        address _address
    )
    external
    view
    returns (Token memory token)
    {
        ( uint id, string memory tla, uint base, string memory name, address owner ) = registry.fromAddress(_address);
        token.id = id;
        token.addr = _address;
        token.tla = tla;
        token.base = base;
        token.name = name;
        token.owner = owner;
    }

    /**
      @dev Get a single token by it's TLA. Reverts if there is no token registered with provided TLA.
      @param _TLA The TLA of the token to get
      @return Token struct
    */
    function fromTLA(
        string calldata _TLA
    )
    external
    view
    returns (Token memory token)
    {
        ( uint id, address addr, uint base, string memory name, address owner ) = registry.fromTLA(_TLA);
        token.id = id;
        token.addr = addr;
        token.tla = _TLA;
        token.base = base;
        token.name = name;
        token.owner = owner;
    }

    /**
        @notice Get all tokens available in registry contract
        @dev The registry does only provide the count of valid tokens, but not a list of existing tokenIDs. Since it
        is possible to unregister existing token entries there will be "gaps" in the tokenID range. Therefor we need to
        keep looking for tokens with increasing ID until we have found the expected number of tokens.
        @return Array of Token structs (relies on experimental ABIEncoderV2!)
    */
    function allTokensAsStructs()
    external
    view
    returns (Token[] memory tokens)
    {
        uint numExpectedTokens = registry.tokenCount();
        tokens = new Token[](numExpectedTokens);
        uint numFoundTokens = 0;
        uint currentId = 0;
        while(numFoundTokens < numExpectedTokens) {
            // registry will revert in case a token has been deleted. This would break the whole call, so first
            // check if the call will succeed via staticcall.
            (bool success, /* bytes memory returnData*/ ) = address(registry).staticcall(abi.encodeWithSignature("token(uint256)", currentId));
            if(success){
                // Perfect, the token 'id' is not deleted. As there is no sane way to obtain the mixture of
                // strings and uints from 'bytes memory returnData' just issue a normal token(id) call, now
                // that I know it won't revert.
                ( address addr, string memory tla, uint base, string memory name, address owner ) = registry.token(currentId);
                tokens[numFoundTokens] = Token(currentId,addr,tla,base,name,owner);
                numFoundTokens++;
            }
            currentId++;
        }
    }

    /**
        @notice Get all tokens available in registry contract
        @dev The registry does only provide the count of valid tokens, but not a list of existing tokenIDs. Since it
        is possible to unregister existing token entries there will be "gaps" in the tokenID range. Therefor we need to
        keep looking for tokens with increasing ID until we have found the expected number of tokens.
        @return IDs, addresses, tlas, bases, names, owners as individual arrays
    */
    function allTokensAsArrays()
    external
    view
    returns (
        uint[] memory ids,
        address[] memory addresses,
        string[] memory tlas,
        uint[] memory bases,
        string[] memory names,
        address[] memory owners
    )
    {
        // prepare arrays
        uint numExpectedTokens = registry.tokenCount();
        ids = new uint[](numExpectedTokens);
        addresses = new address[](numExpectedTokens);
        tlas = new string[](numExpectedTokens);
        bases = new uint[](numExpectedTokens);
        names = new string[](numExpectedTokens);
        owners = new address[](numExpectedTokens);

        uint numFoundTokens = 0;
        uint currentId = 0;
        while(numFoundTokens < numExpectedTokens) {
            // registry will revert in case a token has been deleted. This would break the whole call, so first
            // check if the call will succeed via staticcall.
            (bool success, /* bytes memory returnData*/ ) = address(registry).staticcall(abi.encodeWithSignature("token(uint256)", currentId));
            if(success){
                // Perfect, the token 'id' is not deleted. As there is no sane way to obtain the mixture of
                // strings and uints from 'bytes memory returnData' just issue a normal token(id) call, now
                // that I know it won't revert.
                ( address addr, string memory tla, uint base, string memory name, address owner ) = registry.token(currentId);
                ids[numFoundTokens] = currentId;
                addresses[numFoundTokens] = addr;
                tlas[numFoundTokens] = tla;
                bases[numFoundTokens] = base;
                names[numFoundTokens] = name;
                owners[numFoundTokens] = owner;
                numFoundTokens++;
            }
            currentId++;
        }
    }
}