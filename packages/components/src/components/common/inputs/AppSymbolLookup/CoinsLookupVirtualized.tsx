import { useState } from "react";
import { ListOnItemsRenderedProps } from "react-window";
import { usePaginatedVirtualList } from "../../../../hooks";
import { LookUpOption } from "./CoinsLookup";
import { CoinsLookup, CoinsLookupProps } from "./CoinsLookup";

export interface OnFetchResponse {
  totalCount: number;
  items: LookUpOption[];
}

interface Props extends Omit<CoinsLookupProps, "options"> {
  pageSize: number;
  onFetchPage: (pageNumber: number) => Promise<OnFetchResponse>;
}

export function CoinsLookupVirtualized({ inputValue, pageSize, onFetchPage, ...props }: Props) {
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
