import { createClerkHandler } from "@clerk/tanstack-react-start/server";
import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";

export default createClerkHandler(
	createStartHandler({
		createRouter,
	}),
)(defaultStreamHandler);
