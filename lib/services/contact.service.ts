import { toast } from "sonner";
import { AxiosErrorShape, errorHandler } from "../config/axios.error";
import { appApi } from "../config/axios.instance";
import { ContactDto } from "../dtos/contact.dto";

export const contactUs = async (data: ContactDto) => {
	try {
		const response = await appApi.post("/contact", data);
		return response.data;
	} catch (error) {
		errorHandler(error as AxiosErrorShape | string);
		throw error;
	}
};
