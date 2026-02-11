// src/app/components/toolIcons.js
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as PiIcons from "react-icons/pi";
import type { IconType } from "react-icons";

const iconMap = {
  ...SiIcons,
  ...FaIcons,
  ...BiIcons,
  ...PiIcons,
} as Record<string, IconType>;

export const TOOL_ICONS = iconMap;
