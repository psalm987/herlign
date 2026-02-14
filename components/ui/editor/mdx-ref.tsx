"use client";
// ForwardRefEditor.tsx
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import {
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  ListsToggle,
  listsPlugin,
  BlockTypeSelect,
  Separator,
  type MDXEditorMethods,
  type MDXEditorProps,
  quotePlugin,
  StrikeThroughSupSubToggles,
} from "@mdxeditor/editor";

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("./mdx"), {
  // Make sure we turn SSR off
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => (
    <Editor
      plugins={[
        linkPlugin(),
        linkDialogPlugin(),
        listsPlugin(),
        quotePlugin(),
        toolbarPlugin({
          toolbarClassName: "flex-wrap",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <Separator />
              <StrikeThroughSupSubToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
            </>
          ),
        }),
      ]}
      // minHeight helps give the editor some initial space
      className="min-h-52 h-auto max-h-96 rounded-md border-0 focus:ring-0 focus-visible:ring-0 overflow-y-scroll [&>.mdxeditor-root-contenteditable]:p-3"
      {...props}
      editorRef={ref}
    />
  ),
);

// TS complains without the following line
ForwardRefEditor.displayName = "ForwardRefEditor";
