import open from "open";
import axios from "axios";
import { Flow } from "flow-launcher-helper";
import { query } from "./api.js";

const { requestParams, showResult, on, run } = new Flow("astro.png");

on("query", () => {
  if (requestParams.join(" ") === "") {
    return showResult({
      title: "Waiting for query...",
      subtitle: "Open Astro docs",
      method: "open_result",
      params: ["https://docs.astro.build"],
      iconPath: "astro.png",
    });
  }
  try {
    const data = query(requestParams.join(" "));
    const results = [];

    data.forEach((item) => {
        let img = 'astro.png';

        results.push({
            title: item.text,
            subtitle: "Open Astro docs",
            method: "open_result",
            params: [ "https://docs.astro.build/" + item.slug ],
            iconPath: img,
        });
    });

    if (results.length === 0) {
      let img = 'astro.png';
      results.push({
          title: requestParams.join(" "),
          subtitle: "Open Astro docs",
          method: "open_result",
          params: [ "https://a.stro.cc/" + requestParams.join(" ") ],
          iconPath: img,
      });
    }

    showResult(...results);
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      return showResult({
        title: "Error",
        subtitle: err.message,
      });
    }
  }
});

on("open_result", () => {
  const url = requestParams[0].toString();
  open(url);
});

run();
