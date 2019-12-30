App = {
    contracts: {},
    loading: false,
    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
    },
    loadContract: async () => {
        // Create a JavaScript version of Smartcontract
        const files = await $.getJSON("Files.json");
        App.contracts.Files = TruffleContract(files);
        App.contracts.Files.setProvider(App.web3Provider);

        // Retrieve Smartcontract currently deployed on blockchain
        App.files = await App.contracts.Files.deployed();
    },
    createFile: async () => {
        App.setLoading(true);
        const fileContent = $("#newFile").val();

        const result = await App.files.createFile(fileContent);
        const fileInfos = result.logs[0].args;
        const file = [fileInfos.id, fileInfos.base64content, fileInfos.isPrivate]
        await App.renderFile(file);
        App.setLoading(false);
    },
    render: async () => {
        if (App.loading) {
            return;
        }

        App.setLoading(true);
        $("#account").html(App.account);
        await App.renderFiles();
        App.setLoading(false);
    },
    renderFiles: async () => {
        const filesCount = await App.files.filesCount();

        for (var i = 1; i <= filesCount; i++) {
            const file = await App.files.files(i);
            await App.renderFile(file);
        }

    },
    renderFile: async (file) => {
        const isPrivateFile = file[2];
        const templateToRender = App.prepareFileTemplate(file);

        if (isPrivateFile) {
            $('#fileList').append(templateToRender);
        } else {
            $('#nonPrivateFileList').append(templateToRender);
        }

        templateToRender.show();
    },
    prepareFileTemplate(file) {
        const $fileTemplate = $('#fileTemplate');
        const fileId = file[0].toNumber();
        const fileContent = file[1];
        const isPrivateFile = file[2];
        const $newTemplate = $fileTemplate.clone();

        $newTemplate.find('.content').html(fileContent);
        $newTemplate.find('input')
            .prop('name', fileId)
            .prop('checked', isPrivateFile)
            .on('click', App.togglePrivateFile);
        return $newTemplate;
    },
    togglePrivateFile: async (event) => {
        App.setLoading(true);
        const fileId = event.target.name;
        const result = await App.files.togglePrivateFile(fileId)
        const fileInfos = result.logs[0].args;
        const file = [fileInfos.id, fileInfos.base64content, fileInfos.isPrivate];
        App.setLoading(false);

        await App.render();
    },
    setLoading: (boolean) => {
        App.loading = boolean;

        const loader = $("#loader");
        const content = $("#content");

        if (boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})