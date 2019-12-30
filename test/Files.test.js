const Files = artifacts.require("Files");

contract('Files', async (accounts) => {
    before(async () => {
        this.files = await Files.deployed();
    })

    it('deploys successfully', async () => {
        const address = await this.files.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });
});