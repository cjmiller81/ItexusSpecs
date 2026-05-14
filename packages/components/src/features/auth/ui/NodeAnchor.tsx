import { Button } from "@mui/material";
import type { MouseEvent } from "react";
import { UiNode, UiNodeAnchorAttributes } from "@ory/client";

export interface NodeAnchorProps {
  node: UiNode;
  attributes: UiNodeAnchorAttributes;
}

export const NodeAnchor = ({ attributes }: NodeAnchorProps) => {
  return (
    <Button
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = attributes.href;
      }}>
      {attributes.title.text}
    </Button>
  );
};
