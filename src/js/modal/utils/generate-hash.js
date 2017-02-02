var generateHash = function() {
    //limit of ~1mil unique IDs
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
};
module.exports = generateHash;
