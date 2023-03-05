const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Remove build directory if it already exists
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Read Campaign.sol file
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");

// Compile the source code
const input = {
	language: "Solidity",
	sources: {
		"Campaign.sol": {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["abi", "evm.bytecode"],
			},
		},
	},
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
	console.error("Failed to compile solidity:");
	output.errors.forEach((err) => {
		console.error(err.formattedMessage);
	});
	process.exit(1);
}

// Create build directory if it does not exist
fs.ensureDirSync(buildPath);

// Write output to a file
for (let contract in output.contracts["Campaign.sol"]) {
	const contractName = contract.replace(".sol", "");
	const abi = output.contracts["Campaign.sol"][contractName].abi;
	const bytecode =
		output.contracts["Campaign.sol"][contractName].evm.bytecode.object;

	fs.outputJsonSync(path.resolve(buildPath, contractName + ".json"), {
		abi,
		bytecode,
	});
	console.log(`Contract JSON file created: ${contractName}.json`);
}

console.log(`Build directory created: ${buildPath}`);
