import { CircleHelp, Droplets, Flame, Trash2, TreePine, Wind, type LucideIcon } from 'lucide-react';
import type { ReportCategory } from '../domain/types';

export const categoryIcons: Record<ReportCategory, LucideIcon> = {
  waste_disposal: Trash2,
  deforestation: TreePine,
  water_pollution: Droplets,
  air_pollution: Wind,
  fire: Flame,
  other: CircleHelp,
};
