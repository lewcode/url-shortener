import "./tracing.js";
import { buildApp } from "./app.js";

const app = buildApp();
const port = Number(process.env.PORT) || 3000;
app
	.listen({
		port,
		host: "0.0.0.0",
	})
	.then(() => app.log.info(`API listening on :${port}`))
	.catch((err) => {
		app.log.error(err, "Failed to start");
		process.exit(1);
	});
