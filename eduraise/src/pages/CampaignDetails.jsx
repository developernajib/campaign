import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useStateContext } from "../context";
import { CountBox, Loader, CustomButton } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { TransactionButton, useReadContract } from "thirdweb/react";

const CampaignDetails = () => {
	const { state } = useLocation();
	const { donate, getDonations, contract, address } = useStateContext();
	const [isLoading, setIsLoading] = useState(false);
	const [amount, setAmount] = useState("");
	const [donators, setDonators] = useState([]);
	const remainingDays = daysLeft(state.deadline);

	const {
		data: allDonors,
		isLoading: isFetchingDonors,
		error: fetchDonorsError,
	} = useReadContract({
		contract,
		method: "function getDonators(uint256 _id) view returns (address[], uint256[])",
		params: [state.pId],
	});

	const fetchDonators = async () => {
		const donations = await getDonations(
			allDonors,
			isFetchingDonors,
			fetchDonorsError
		);
		setDonators(donations);
	};

	useEffect(() => {
		if (!isFetchingDonors && contract) {
			fetchDonators();
		}
	}, [isFetchingDonors, contract]);

	const handleDonate = async () => {
		setIsLoading(true);
		await donate(state.pId, amount, address, state.owner);
		setIsLoading(false);
	};

	return (
		<div>
			{isLoading && <Loader title="Transaction is in progress" />}
			<div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
				<div className="flex-1 flex-col">
					<img
						src={state.image}
						alt="campaign"
						className="w-full h-[410px] object-cover rounded-xl"
					/>
					<div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
						<div
							className="absolute h-full bg-[#09d3ac]"
							style={{
								width: `${calculateBarPercentage(
									state.target,
									state.amountCollected
								)}%`,
								maxWidth: "100%",
							}}
						></div>
					</div>
				</div>

				<div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
					{remainingDays < 0 ? (
						<CountBox title="Days Left" value="Ended" />
					) : (
						<CountBox title={`Days Left`} value={remainingDays} />
					)}
					<CountBox
						title={`Raised of ${state.target}`}
						value={state.amountCollected}
					/>
					<CountBox title="Total Backers" value={donators.length} />
				</div>
			</div>

			<div className="mt-[60px] flex lg:flex-row flex-col gap-5">
				<div className="flex-[2] flex flex-col gap-[40px]">
					<div>
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
							Title
						</h4>

						<div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
							<div>
								<h4 className="font-epilogue font-semibold text-[18px] text-white break-all">
									{state.title}
								</h4>
							</div>
						</div>
					</div>
					<div>
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
							Creator
						</h4>

						<div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
							<div>
								<h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
									{state.owner}
								</h4>
							</div>
						</div>
					</div>

					<div>
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
							Description
						</h4>

						<div className="mt-[20px]">
							<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
								{state.description}
							</p>
						</div>
					</div>

					<div>
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
							Donators
						</h4>

						<div className="mt-[20px] flex flex-col gap-4">
							{donators.length > 0 ? (
								donators.map((item, index) => (
									<div
										key={`${item.donator}-${index}`}
										className="flex justify-between items-center gap-4"
									>
										<p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
											{index + 1}. {item.donator}
										</p>
										<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
											{item.donation}
										</p>
									</div>
								))
							) : (
								<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
									No donators yet. Be the first one!
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex-1">
					<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
						Fund
					</h4>

					{remainingDays > 0 ? (
						<div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
							<p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
								Fund the campaign
							</p>
							<div className="mt-[30px]">
								<input
									type="number"
									placeholder="1.00"
									step="0.01"
									className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
								/>
								<div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
									<h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
										Back it because you believe in it.
									</h4>
									<p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
										Reward not set yet !
									</p>
								</div>
								{/* <CustomButton
									btnType="button"
									title="Fund Campaign"
									styles="w-full bg-[#8c6dfd]"
									handleClick={handleDonate}
								/> */}

								<TransactionButton
									transaction={() => handleDonate()}
									payModal={false}
									onTransactionConfirmed={(receipt) =>
										toast.success(
											"You have successfully donated to the campaign!",
											receipt.transactionHash
										)
									}
									onTransactionSent={(result) => {
										toast.success(
											"Transaction submitted",
											result.transactionHash
										);
									}}
									onError={() => {
										toast.warning(
											"Thirdweb caused error, but don't warry campaign donation will be continue after comfirmation !"
										);
									}}
									unstyled
									className="w-full bg-[#8c6dfd] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]"
								>
									Fund Campaign
								</TransactionButton>
							</div>
							<h4 className="mt-[12px] text-red-600 font-epilogue font-semibold text-[14px] leading-[22px] text-white">
								Note: Thirdweb has some problem with there package. You fill face an error when donate. But don't worry, the transaction will be processed after you comfirm it.
							</h4>
							<h4 className="mt-[12px] text-red-600 font-epilogue font-semibold text-[14px] leading-[22px] text-white">
								Note: Thirdweb payment modal will show wrong value. Don't worry we have talk to them, they will fix it as soon as possible.
							</h4>
						</div>
					) : (
						<div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
							<p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
								Campaign has ended
							</p>
							<div className="mt-[30px]">
								<div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
									<h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
										Campaign ended with{" "}
										{state.amountCollected} Donation.
									</h4>
									<p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
										Reward not set yet !
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CampaignDetails;