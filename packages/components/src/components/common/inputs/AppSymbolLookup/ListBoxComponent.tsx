import { Box, ListSubheader, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import * as React from "react"
import { ListChildComponentProps, ListOnItemsRenderedProps, ReactElementType, VariableSizeList } from "react-window"
import { OuterElementType } from "./OuterElementType"

const MAX_LIST_ITEMS = 9
export default function renderRow(props: ListChildComponentProps) {
  const { data, index } = props
  const dataSet = data[index]

  return (
    <Box
      component="li"
      {...dataSet[0]}
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
      {...props}>
      <img
        loading="lazy"
        width="20"
        src={dataSet[1].iconUrl}
        alt=""
      />
      <Typography noWrap>{dataSet[1]?.label}</Typography>
    </Box>
  )
}

export function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

export const OuterElementContext = React.createContext({})
type Props = React.HTMLAttributes<HTMLElement> & { 
  onItemsRendered?: ((props: ListOnItemsRenderedProps) => any) | undefined
  onScrollChanged?: (itemIndex: number) => any
}
export const ListboxComponent = React.forwardRef<HTMLDivElement, Props>(
  function ListboxComponent({ children, onItemsRendered, onScrollChanged, ...other }, ref) {
    const itemData: React.ReactElement[] = []
    ;(children as React.ReactElement[]).forEach((item: React.ReactElement & { children?: React.ReactElement[] }) => {
      itemData.push(item)
      itemData.push(...(item.children || []))
    })

    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
      noSsr: true,
    })
    const itemCount = itemData.length
    const itemSize: number = smUp ? 36 : 48

    const getChildSize = (child: React.ReactElement) => {
      if (child.hasOwnProperty("group")) {
        return 48
      }

      return itemSize
    }

    const getHeight = () => {
      if (itemCount > MAX_LIST_ITEMS) {
        return MAX_LIST_ITEMS * itemSize
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
    }

    const gridRef = useResetCache(itemCount)

    const onItemRender = (props: ListOnItemsRenderedProps) => {
      if(onItemsRendered){
        onItemsRendered(props)
      }
    }

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 8}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType as ReactElementType}
            innerElementType="ul"
            itemSize={() => itemSize}
            overscanCount={5}
            onItemsRendered={onItemRender}
            itemCount={itemCount}>
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    )
  },
)
