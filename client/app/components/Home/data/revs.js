import React from "react";
import TimeAgo from "timeago-react";
export const revData = [
  {
    title: (
      <p>
        Rev 0.1
        <span className="badge badge-info">Major Update</span>
      </p>
    ),
    bodyTitle: "Introducting SR-Skins",
    body: (
      <p>
        This tool is essentially a SpeedRunners custom skin creator, that has
        the ability to take images as frames from your selected animation, packs
        them all into an XNB and ATLAS. We&#39;re going to try to update the app
        as frequent as possible, and make your user experience as good as
        possible. <br />
        <span style={{ color: "lightgreen" }}>
          If you want to leave any feedback/suggestions on the app, please
          follow{" "}
          <a
            href="https://goo.gl/forms/sl1zZ7LD4ErzENjs2"
            rel="noopener noreferrer"
            target="_blank"
          >
            this
          </a>{" "}
          link for a form.
        </span>
      </p>
    ),
    date: <TimeAgo datetime={"2018-08-19 08:08:08"} locale="us_EN" />
  }
];
