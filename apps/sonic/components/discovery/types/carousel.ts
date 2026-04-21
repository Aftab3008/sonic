export interface SpotlightItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
}

export interface CarouselItemProps {
  item: SpotlightItem;
  onPress?: (item: SpotlightItem) => void;
}

export interface SpotlightCarouselProps {
  items: SpotlightItem[];
  onPress?: (item: SpotlightItem) => void;
}
