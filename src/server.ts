import * as express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as HttpErrors from "http-errors";
import { getScoreboardPage, getUnauthorisedPage } from "./react";
import reportCache from "./report-cache";
import ReportGenerator from "./report-generator";
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger("common"));

app.use(express.static(path.resolve(__dirname, "../static")));

app.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getScoreboardPage(reportCache.get()));
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(err instanceof HttpErrors.HttpError)) {
        console.error(err);
        err = new HttpErrors.InternalServerError();
    }
    res.statusCode = (err as HttpErrors.HttpError).statusCode;
    res.jsonp(err);
});

app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", async () => {
    // Generate a new report if it is null
    if (reportCache.get() === null) {
        const rg = new ReportGenerator();
        await rg.run();
    }
    console.log("listening on 3000");
});
