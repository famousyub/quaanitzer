import "bootstrap";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "../css/quanta.scss";
import AppContainer from "./comp/core/AppContainer";
import TutorialAppContainer from "./comp/core/TutorialAppContainer";
import { Factory } from "./Factory";
import { ImportTest } from "./ImportTest";
import { S } from "./Singletons";
import TsxApp from "./TsxApp";

// we have this as the first import for troubleshooting how browsers are
// able to handle the 'import' statement.
ImportTest.check();
console.log("index.ts finished imports");

// This is how we run the main app (normal flow)
window.addEventListener("load", async (event) => {
    const root = createRoot(document.getElementById("app"));
    const factory = new Factory();
    await S.quanta.loadConfig();

    const urlParams = new URLSearchParams(window.location.search);
    const app = urlParams.get("app");
    console.log("app=" + app);
    let appComp: any = null;
    switch (app) {
        // http://127.0.0.1:8182/?app=TxsApp
        case "TsxApp":
            // NOTE: We can use JSX like this if we want... just by renaming this file to ".tsx" extension
            // and of source updating the reference ti this index file in the webpack common config file.
            // root.render(<AppContainer />);
            appComp = TsxApp;
            console.log("TsxApp");
            break;

        // http://127.0.0.1:8182/?app=TutorialAppContainer
        case "TutorialAppContainer":
            appComp = TutorialAppContainer;
            console.log("TutorialAppContainer");
            break;

        // normal Quanta app if no "app=" parameter is given.
        default:
            appComp = AppContainer;
            console.log("AppContainer");
            break;
    }

    root.render(React.createElement(appComp));
    factory.initApp();
});
