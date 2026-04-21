import { FC } from "react";
import Logo from "./Logo";

const Loader: FC = () => {
	return (
		<div className="flex justify-center items-center gap-8 rounded-full bg-[#242424] shadow-md">
			<Logo isLoading />
		</div>
	);
};

export default Loader;
