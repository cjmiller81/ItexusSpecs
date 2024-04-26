import { Typography, styled } from "@mui/material"
import { UiNode, UiNodeTextAttributes, UiText } from "@ory/client"
import { CodeBox } from "@ory/themes"

interface Props {
  node: UiNode
  attributes: UiNodeTextAttributes
}

const ScrollableCodeBox = styled(CodeBox)(() => ({
  overflowX: "auto",
  color: "black",
  border: "solid 1px",
  textAlign: "center",
}))

export const Content = ({ attributes }: Props) => {
  switch (attributes.text.id) {
    case 1050015:
      // This text node contains lookup secrets. Let's make them a bit more beautiful!
      const secrets = (attributes.text.context as any).secrets.map((text: UiText, k: number) => (
        <div
          key={k}
          data-testid={`node/text/${attributes.id}/lookup_secret`}>
          {/* Used lookup_secret has ID 1050014 */}
          <code>{text.id === 1050014 ? "Used" : text.text}</code>
        </div>
      ))
      return (
        <div
          className="container-fluid"
          data-testid={`node/text/${attributes.id}/text`}>
          <div className="row">{secrets}</div>
        </div>
      )
  }

  return (
    <div data-testid={`node/text/${attributes.id}/text`}>
      <ScrollableCodeBox code={attributes.text.text} />
    </div>
  )
}

export const NodeText = ({ node, attributes }: Props) => {
  return (
    <>
      <Typography
        variant="body2"
        data-testid={`node/text/${attributes.id}/label`}>
        {node.meta?.label?.text}
      </Typography>
      <Content
        node={node}
        attributes={attributes}
      />
    </>
  )
}
