import { useState } from "react";
import { ListOnItemsRenderedProps } from "react-window";
import { usePaginatedVirtualList } from "../../../../hooks";
import { CoinsLookUpOption } from "./CoinsLookup";
import { CoinsLookup, CoinsLookupProps } from "./CoinsLookup";

export interface OnFetchCoinsResponse {
  totalCount: number;
  items: CoinsLookUpOption[];
}

export interface CoinsLookupVirtualizedProps extends Omit<CoinsLookupProps, "options"> {
  pageSize: number;
  onFetchPage: (pageNumber: number) => Promise<OnFetchCoinsResponse>;
}

export function CoinsLookupVirtualized({ inputValue, pageSize, onFetchPage, ...props }: CoinsLookupVirtualizedProps) {
  const [lookupRenderProps, setLookupRenderProps] = useState<ListOnItemsRenderedProps>({
    overscanStartIndex: 0,
    overscanStopIndex: 0,
    visibleStartIndex: 0,
    visibleStopIndex: 0,
  });

  const buffer = usePaginatedVirtualList(inputValue || "", pageSize, lookupRenderProps, async page => {
    const response = await onFetchPage(page);
    return {
      items: response.items,
      totalCount: response.totalCount,
    };
  });

  const onItemsRendered = (renderProps: ListOnItemsRenderedProps) => {
    setLookupRenderProps(renderProps);
  };

  return (
    <>
      <CoinsLookup
        {...props}
        onItemsRendered={onItemsRendered}
        inputValue={inputValue}
        options={buffer}></CoinsLookup>
    </>
  );
}
