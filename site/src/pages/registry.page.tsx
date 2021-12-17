import { GetStaticProps } from "next";
import React from "react";

export const getStaticProps: GetStaticProps = async () => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  const glob = require("glob");
  /* eslint-enable global-require */

  return {
    props: {
      paths: glob
        .sync(`${process.cwd()}/../registry/**/*.json`)
        .map((path: string) =>
          JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
        ),
    },
  };
};

const Registry: React.VFC<{ paths: string[] }> = ({ paths }) => {
  return (
    <main>
      <p>Found {paths.length} block configs in the registry</p>
      <ul>
        {paths.map((path) => (
          <li key={path}>{path}</li>
        ))}
      </ul>
    </main>
  );
};

export default Registry;
