import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";

export function MDXRenderer({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]]
          }
        }}
      />
    </div>
  );
}
