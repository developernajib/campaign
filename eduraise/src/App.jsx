import React from "react";
import { Route, Routes } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	return (
		<>
			<div className="relative sm:p-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
				<div className="sm:flex hidden mr-10 relative">
					<Sidebar />
				</div>
				<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<Profile />} />
						<Route
							path="/create-campaign"
							element={<CreateCampaign />}
						/>
						<Route
							path="/campaign-details/:id"
							element={<CampaignDetails />}
						/>
					</Routes>
				</div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</>
	);
};

export default App;
