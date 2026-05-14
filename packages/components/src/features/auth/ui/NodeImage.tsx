import { UiNode, UiNodeImageAttributes } from "@ory/client";

export interface NodeImageProps {
  node: UiNode;
  attributes: UiNodeImageAttributes;
}

export const NodeImage = ({ node, attributes }: NodeImageProps) => {
  return (
    <img
      data-testid={`node/image/${attributes.id}`}
      src={attributes.src}
      alt={node.meta.label?.text}
    />
  );
};
