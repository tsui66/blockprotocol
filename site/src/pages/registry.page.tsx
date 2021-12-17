import { GetStaticProps } from "next";
import React from "react";

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps = async () => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  // const fs = require("fs");
  const glob = require("glob");
  /* eslint-enable global-require */

  return {
    props: { paths: glob.sync(`${process.cwd()}/../registry/**/*.json`) },
  };
  // .map((path: string) => ({
  //   // @todo should be redundant to block's package.json#name
  //   packagePath: path.split("/").slice(-3, -1).join("/"),
  //   ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
  // }));
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
