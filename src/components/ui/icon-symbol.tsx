// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Tabs
  'house.fill': 'home',
  house: 'home',
  'safari.fill': 'explore',
  safari: 'explore',
  'building.columns.fill': 'account-balance',
  'building.columns': 'account-balance',
  'map.fill': 'map',
  map: 'map',
  'person.fill': 'person',
  person: 'person',

  // Actions / UI Elements
  'paperplane.fill': 'send',
  'compass.fill': 'explore',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.right': 'arrow-forward',
  'photo.on.rectangle.angled': 'photo-library',
  'globe.asia.australia.fill': 'public',
  'sparkles': 'auto-awesome',
  'newspaper.fill': 'article',
  magnifyingglass: 'search',
  'book.fill': 'book',
  'lock.fill': 'lock',
  'envelope.fill': 'email',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'crown.fill': 'emoji-events',
  'doc.text.fill': 'article',
  'building.2.fill': 'business',
  'building.2': 'business',
  'tag.fill': 'local-offer',
  'photo.fill': 'photo',
  'person.2.fill': 'people',
  'person.crop.circle.fill': 'account-circle',
  'checkmark.circle.fill': 'check-circle',
  'location.fill': 'place',
  'star.fill': 'star',
  star: 'star',
  'video.fill': 'videocam',
  'checkmark.seal.fill': 'verified',
  'square.and.arrow.up.fill': 'share',
  'square.and.arrow.up': 'share',
  'bubble.left': 'comment',
  'pencil.and.outline': 'edit',
  link: 'link',
  pencil: 'edit',
  'trash.fill': 'delete',
  'plus.circle.fill': 'add-circle',
  'gearshape.fill': 'settings',
  gearshape: 'settings',
  'bell.fill': 'notifications',
  bell: 'notifications',
  'clock.fill': 'history',
  clock: 'history',
  'questionmark.circle.fill': 'help',
  'info.circle.fill': 'info',
  'arrow.left.circle.fill': 'logout',
  'person.circle.fill': 'account-circle',
  'mappin.circle.fill': 'place',
  'arrow.up.arrow.down': 'swap-vert',
  'party.popper.fill': 'celebration',
  'paintpalette.fill': 'palette',
  'fork.knife': 'restaurant',
  'music.note': 'music-note',
  'party.popper': 'celebration',
  'paintpalette': 'palette',
  'square.grid.2x2': 'grid-view',

  // Custom added for heritage detail and layout
  heart: 'favorite-border',
  'heart.fill': 'favorite',
  bookmark: 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'line.horizontal.3': 'menu',
  mic: 'mic',
  'gear.badge': 'admin-panel-settings',
  plus: 'add',
  'exclamationmark.triangle.fill': 'warning',
  'exclamationmark.circle.fill': 'error',

  // Admin / management icons
  'doc.text': 'article',
  'photo': 'photo',
  'xmark.circle': 'cancel',
  'xmark.circle.fill': 'cancel',
  'eye': 'visibility',
  'trash': 'delete',
  'arrow.clockwise': 'refresh',
  'pencil.circle.fill': 'edit',
  'camera.fill': 'camera-alt',
  'chart.bar.fill': 'bar-chart',
  'newspaper': 'newspaper',
  'arrow.left': 'arrow-back',
  'person.badge.plus.fill': 'person-add',
  'checkmark.circle': 'check-circle-outline',
  'exclamationmark.octagon.fill': 'report',
  'doc.text.magnifyingglass': 'manage-search',
  'arrow.up.right': 'open-in-new',
  'arrow.down': 'arrow-downward',
  'arrow.up': 'arrow-upward',
  'checkmark': 'check',
  'xmark': 'close',
  'calendar': 'calendar-today',
  'calendar.fill': 'calendar-today',
  'flag.fill': 'flag',
  'flag': 'flag',
  'printer.fill': 'print',
  'square.and.pencil': 'edit-note',
  'folder.fill': 'folder',
  'folder': 'folder-open',
  'cloud.fill': 'cloud',
  'cloud.upload.fill': 'cloud-upload',
  'shield.fill': 'security',
  'bell.badge.fill': 'notifications-active',
  'ellipsis': 'more-horiz',
  'ellipsis.circle': 'more-horiz',
  'chart.pie.fill': 'pie-chart',
  'person.3.fill': 'groups',
  'mappin.fill': 'place',
  'mappin': 'place',
  'checkmark.square.fill': 'check-box',
  'square': 'check-box-outline-blank',

  // Missing Icons mapping fallback
  'moon.fill': 'brightness-3',
  'app.fill': 'apps',
  'internaldrive.fill': 'storage',
  'doc.fill': 'description',
  'slider.horizontal.3': 'tune',
  'globe': 'public',
  'headphones': 'headphones',
  'bell.slash.fill': 'notifications-off',
  'arrow.down.circle.fill': 'arrow-circle-down',
  'exclamationmark.triangle': 'warning-amber',
  'list.bullet.circle.fill': 'list',
  'lock.rotation': 'lock-reset',
  'lock.open.fill': 'lock-open',
  'checkmark.shield.fill': 'verified-user',
  'key.fill': 'key',
  'photo.on.rectangle': 'photo-library',
  'camera': 'camera-alt',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
