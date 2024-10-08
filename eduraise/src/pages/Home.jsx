import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { useReadContract } from "thirdweb/react";

const Home = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { contract, getCampaigns } = useStateContext();

	const {
		data: allCampaignsData,
		isLoading: isFetchingCampaigns,
		error: fetchCampaignsError,
	} = useReadContract({
		contract,
		method: "function getAllCampaigns() view returns (address[] owners, string[] titles, string[] descriptions, uint256[] targets, uint256[] deadlines, uint256[] amountCollecteds, string[] images)",
		params: [],
	});

	useEffect(() => {
		if (!isFetchingCampaigns && contract) {
			fetchCampaigns();
		}
	}, [isFetchingCampaigns, contract]);

	const fetchCampaigns = async () => {
		setIsLoading(true);
		if (getCampaigns) {
			try {
				const data = await getCampaigns(
					allCampaignsData,
					isFetchingCampaigns,
					fetchCampaignsError
				);
				setCampaigns(data);
			} catch (error) {
				toast.error("Failed to fetch campaigns: " + error.message);
			}
		} else {
			toast.error("Get campaigns function is not available.");
		}
		setIsLoading(false);
	};

	return (
		<DisplayCampaigns
			title="All Campaigns"
			isLoading={isLoading}
			campaigns={campaigns}
		/>
	);
};

export default Home;
