
function createAddress(address, city, country) {
    var addressTotal = address;

    if (city !== "" && country !== "") {
        addressTotal = addressTotal + ", <br/>" + city + ", " + country;
    }
    if (city === "" && country !== "") {
        addressTotal = addressTotal + ", <br/>" + country;
    }
    if (country === "" && city !== "") {
        addressTotal = addressTotal + ", <br/>" + city;
    }

    return addressTotal;
}

module.exports.createAddress = createAddress;
