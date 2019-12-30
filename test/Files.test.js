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

    it('create file', async () => {
        const result = await this.files.createFile('Ceci est le deuxième fichier.');
        console.log(result);
        const fileCount = await this.files.filesCount();

        assert.equal(fileCount, 2);

        const event = result.logs[0].args;
        assert.equal(event.id.toNumber(), fileCount);
        assert.equal(event.base64content, 'Ceci est le deuxième fichier.');
    });

    it('update private\'s file property', async () => {
        const result = await this.files.togglePrivateFile(2);
        const event = result.logs[0].args;

        assert.isTrue(event.isPrivate);
    });
});