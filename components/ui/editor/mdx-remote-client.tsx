"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import type React from "react";

interface Props {
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
  components?: Record<string, React.ComponentType<unknown>>;
}

export default function MdxRemoteClient({ source, components }: Props) {
  return <MDXRemote {...source} components={components} />;
}
