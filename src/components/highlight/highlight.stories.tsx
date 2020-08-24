import React from "react";
import { Highlight } from "./index";
import { withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Highlight",
  component: Highlight,
  decorators: [withKnobs],
};

const javascriptCode = `import React from 'react'

const MyComponent = () => (
  <div>My component renders all the things</div>
)

export default MyComponent
`;

const typescriptCode = `import React from 'react'

export function Highlight(props: PropsWithChildren<HighlightProps>) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const { children, language } = props;
	const codeBlock = (
		<div dangerouslySetInnerHTML={{ __html: escape(children + "") }} />
	);
	useEffect(() => {
		if (nodeRef.current) {
			Prism.highlightAllUnder(nodeRef.current);
		}
	}, [nodeRef]);
	return (
		<HighlightBlock ref={nodeRef}>
			<pre className={\`language-$\{language}\`}>
				<code className={\`language-$\{language}\`}>{codeBlock}</code>
			</pre>
		</HighlightBlock>
	);
}
`;

const cssCode = `.someClass {
  position: relative;
}
`;

const jsonCode = `{
  "name": "@yourorg/package",
  "version": "0.0.1",
  "description": "A sweet package",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/package.git"
  }
}`;
export const javascript = () => (
  <>
    <Highlight language="javascript">{javascriptCode}</Highlight>
  </>
);
export const typescript = () => (
  <>
    <Highlight language="typescript">{typescriptCode}</Highlight>
  </>
);
export const css = () => (
  <>
    <Highlight language="css">{cssCode}</Highlight>
  </>
);
export const json = () => (
  <>
    <Highlight language="css">{jsonCode}</Highlight>
  </>
);
